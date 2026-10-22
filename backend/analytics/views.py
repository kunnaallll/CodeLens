from datetime import timedelta

from django.db.models import Avg, Count, Q
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from algorithms.models import Algorithm
from challenges.models import Score, Submission
from progress.models import Progress


class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        submissions = Submission.objects.filter(user=user)
        total_attempts = submissions.count()
        correct_attempts = submissions.filter(is_correct=True).count()
        accuracy = round(correct_attempts * 100 / total_attempts) if total_attempts else 0

        history = list(
            Score.objects.filter(user=user)
            .select_related('submission__challenge')
            .order_by('created_at')
            .values('total_score', 'created_at', 'submission__challenge__title')
        )[-30:]
        score_history = [{
            'score': row['total_score'],
            'date': row['created_at'].date().isoformat(),
            'challenge': row['submission__challenge__title'],
        } for row in history]

        today = timezone.localdate()
        weekly_activity = []
        for days_ago in range(6, -1, -1):
            date = today - timedelta(days=days_ago)
            count = submissions.filter(submitted_at__date=date).count() + Progress.objects.filter(
                user=user, completed_at__date=date
            ).count()
            weekly_activity.append({'date': date.isoformat(), 'count': count})

        completion_rows = Algorithm.objects.values('category').annotate(
            total=Count('id', distinct=True),
            completed=Count(
                'progress_records',
                filter=Q(progress_records__user=user, progress_records__completed=True),
                distinct=True,
            ),
        ).order_by('category')
        algorithm_completion = list(completion_rows)
        category_ratios = [
            (row['category'], row['completed'] / row['total'])
            for row in algorithm_completion if row['total']
        ]
        completed_categories = {row['category'] for row in algorithm_completion if row['completed']}
        weak_areas = [
            name for name, ratio in sorted(category_ratios, key=lambda item: item[1])
            if name in completed_categories and ratio < 0.5
        ][:2]

        challenge_performance = list(
            Score.objects.filter(user=user)
            .values('submission__challenge__difficulty')
            .annotate(average_score=Avg('total_score'))
            .order_by('submission__challenge__difficulty')
        )
        challenge_performance = [{
            'difficulty': row['submission__challenge__difficulty'],
            'average_score': round(row['average_score'] or 0, 1),
        } for row in challenge_performance]
        topic_performance = list(
            Score.objects.filter(user=user)
            .values('submission__challenge__topic')
            .annotate(average_score=Avg('total_score'))
            .order_by('submission__challenge__topic')
        )
        topic_performance = [{
            'category': row['submission__challenge__topic'],
            'average_score': round(row['average_score'] or 0, 1),
        } for row in topic_performance]

        return Response({
            'accuracy': accuracy,
            'weak_areas': weak_areas,
            'score_history': score_history,
            'weekly_activity': weekly_activity,
            'algorithm_completion': algorithm_completion,
            'challenge_performance': challenge_performance,
            'topic_performance': topic_performance,
            'has_data': bool(total_attempts or any(row['completed'] for row in algorithm_completion)),
        })
