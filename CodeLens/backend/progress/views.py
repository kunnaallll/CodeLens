from rest_framework import generics
from .models import Progress
from .serializers import ProgressSerializer


class ProgressListCreateView(generics.ListCreateAPIView):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer