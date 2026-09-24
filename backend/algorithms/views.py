from rest_framework import generics
from .models import Algorithm
from .serializers import AlgorithmSerializer


class AlgorithmListCreateView(generics.ListCreateAPIView):
    queryset = Algorithm.objects.all()
    serializer_class = AlgorithmSerializer


class AlgorithmDetailView(generics.RetrieveAPIView):
    queryset = Algorithm.objects.all()
    serializer_class = AlgorithmSerializer