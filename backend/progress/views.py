from datetime import timedelta

from django.db.models import Count, Q, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, serializers
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from algorithms.models import Algorithm
from challenges.models import Score, Submission
from .models import Achievement, Progress, UserAchievement
from .services import award_eligible_achievements
from .serializers import AchievementSerializer, ProgressSerializer
from challenges.serializers import ScoreSerializer


class ProgressListCreateView(generics.ListAPIView):
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Progress.objects.filter(user=self.request.user).select_related('algorithm')

class RecordProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        algorithm_id = request.data.get('algorithm')
        if not str(algorithm_id or '').isdigit():
            raise serializers.ValidationError({'algorithm': 'Choose a valid algorithm.'})
        algorithm = get_object_or_404(Algorithm, pk=algorithm_id)
        progress, _ = Progress.objects.get_or_create(user=request.user, algorithm=algorithm)
        if not progress.completed:
            progress.completed = True
            progress.completed_at = timezone.now()
            progress.save(update_fields=('completed', 'completed_at', 'updated_at'))
        award_eligible_achievements(request.user)
        return Response(ProgressSerializer(progress).data)


class ProgressSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        completed = Progress.objects.filter(user=request.user, completed=True)
        scores = Score.objects.filter(user=request.user)
        submissions = Submission.objects.filter(user=request.user)
        activity_days = set(submissions.dates('submitted_at', 'day', order='DESC'))
        activity_days.update(
            Progress.objects.filter(user=request.user, completed_at__isnull=False)
            .dates('completed_at', 'day', order='DESC')
        )
        streak = 0
        day = timezone.localdate()
        if day not in activity_days:
            day -= timedelta(days=1)
        while day in activity_days:
            streak += 1
            day -= timedelta(days=1)
        return Response({
            'algorithms_completed': completed.count(),
            'challenges_completed': submissions.filter(is_correct=True).values('challenge_id').distinct().count(),
            'total_score': scores.aggregate(total=Sum('points_awarded'))['total'] or 0,
            'current_streak': streak,
        })


class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        period = request.query_params.get('period', 'all')
        if period not in ('all', 'weekly'):
            raise serializers.ValidationError({'period': 'Choose all or weekly.'})
        scores = Score.objects.select_related('user', 'submission')
        if period == 'weekly':
            start = timezone.now() - timedelta(days=7)
            scores = scores.filter(created_at__gte=start)
        totals = scores.values('user_id', 'user__username').annotate(
            total_score=Sum('points_awarded'),
            challenges_completed=Count('submission__challenge_id', distinct=True),
            attempts=Count('id'),
            correct=Count('id', filter=Q(submission__is_correct=True)),
        ).order_by('-total_score', '-challenges_completed', 'user__username')
        results = []
        for rank, row in enumerate(totals, start=1):
            results.append({
                'rank': rank,
                'username': row['user__username'],
                'total_score': row['total_score'] or 0,
                'challenges_completed': row['challenges_completed'],
                'accuracy': round(row['correct'] / row['attempts'] * 100) if row['attempts'] else 0,
            })
        return Response({'results': results, 'period': period})


class AchievementListCreateView(generics.ListCreateAPIView):
    serializer_class = AchievementSerializer

    def get_queryset(self):
        queryset = Achievement.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        return queryset

    def get_permissions(self):
        if self.request.method not in ('GET', 'HEAD', 'OPTIONS'):
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        unlocked = UserAchievement.objects.filter(user=self.request.user).select_related('achievement')
        context['unlocked_records'] = {record.achievement_id: record for record in unlocked}
        context['unlocked_ids'] = set(context['unlocked_records'])
        return context


class AchievementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    lookup_field = 'code'

    def get_queryset(self):
        queryset = Achievement.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        return queryset

    def get_permissions(self):
        if self.request.method not in ('GET', 'HEAD', 'OPTIONS'):
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        unlocked = UserAchievement.objects.filter(user=self.request.user).select_related('achievement')
        context['unlocked_records'] = {record.achievement_id: record for record in unlocked}
        context['unlocked_ids'] = set(context['unlocked_records'])
        return context


class MyScoresListView(generics.ListAPIView):
    serializer_class = ScoreSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Score.objects.filter(user=self.request.user).select_related('submission__challenge')
