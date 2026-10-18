
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Challenge
from .serializers import ChallengeSerializer


class ChallengeListCreateView(generics.ListCreateAPIView):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]
