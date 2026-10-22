import math

from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view

from .models import Algorithm
from .models import DataStructure
from .serializers import AlgorithmSerializer, DataStructureSerializer
from .bubble_sort import bubble_sort_steps
from .selection_sort import selection_sort_steps
from config.permissions import IsAdminOrReadOnly


class AlgorithmListCreateView(generics.ListCreateAPIView):
    serializer_class = AlgorithmSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Algorithm.objects.all()
        return queryset if self.request.user.is_staff else queryset.filter(is_published=True)


class AlgorithmDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AlgorithmSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Algorithm.objects.all()
        return queryset if self.request.user.is_staff else queryset.filter(is_published=True)

    def get_object(self):
        identifier = self.kwargs['lookup']
        query = Q(slug=identifier)
        if identifier.isdigit():
            query |= Q(pk=int(identifier))
        return get_object_or_404(self.get_queryset(), query)


class DataStructureListCreateView(generics.ListCreateAPIView):
    queryset = DataStructure.objects.all()
    serializer_class = DataStructureSerializer
    permission_classes = [IsAdminOrReadOnly]


class DataStructureDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DataStructure.objects.all()
    serializer_class = DataStructureSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_object(self):
        identifier = self.kwargs['lookup']
        query = Q(slug=identifier)
        if identifier.isdigit():
            query |= Q(pk=int(identifier))
        return get_object_or_404(self.get_queryset(), query)


def validate_numeric_array(values):
    if not isinstance(values, list):
        raise serializers.ValidationError({'array': 'Provide an array of numbers.'})
    if len(values) > 100:
        raise serializers.ValidationError({'array': 'Use 100 numbers or fewer.'})
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or (isinstance(value, float) and not math.isfinite(value))
        for value in values
    ):
        raise serializers.ValidationError({'array': 'Every array item must be a finite number.'})
    return values


class BubbleSortStepsView(APIView):
    def post(self, request):
        values = validate_numeric_array(request.data.get("array"))
        return Response(bubble_sort_steps(values))


@api_view(["POST"])
def selection_sort_visualization(request):
    numbers = validate_numeric_array(request.data.get("array"))
    return Response(selection_sort_steps(numbers))
