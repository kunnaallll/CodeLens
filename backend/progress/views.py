
from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Progress
from .serializers import ProgressSerializer
from algorithms.models import Algorithm


class ProgressListCreateView(generics.ListCreateAPIView):
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Progress.objects.filter(
            user=self.request.user
        ).select_related('algorithm')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RecordProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        algorithm_id = request.data.get('algorithm')

        try:
            algorithm = Algorithm.objects.get(pk=algorithm_id)
        except (Algorithm.DoesNotExist, TypeError, ValueError):
            raise serializers.ValidationError({
                'algorithm': 'Choose a valid algorithm.'
            })

        progress, _ = Progress.objects.get_or_create(
            user=request.user,
            algorithm=algorithm
        )

        if not progress.completed:
            progress.completed = True
            progress.save(update_fields=['completed'])

        return Response(ProgressSerializer(progress).data)
