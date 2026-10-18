from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view

from .models import Algorithm
from .serializers import AlgorithmSerializer
from .bubble_sort import bubble_sort_steps
from .selection_sort import selection_sort_steps


class AlgorithmListCreateView(generics.ListCreateAPIView):
    queryset = Algorithm.objects.all()
    serializer_class = AlgorithmSerializer


class AlgorithmDetailView(generics.RetrieveAPIView):
    queryset = Algorithm.objects.all()
    serializer_class = AlgorithmSerializer


class BubbleSortStepsView(APIView):
    def post(self, request):
        values = request.data.get("array")

        if not isinstance(values, list) or not all(
            isinstance(value, (int, float)) and not isinstance(value, bool)
            for value in values
        ):
            return Response(
                {"array": "Provide an array of numbers."},
                status=400
            )

        return Response(bubble_sort_steps(values))


@api_view(["POST"])
def selection_sort_visualization(request):
    data = request.data.get("array")

    if not isinstance(data, list):
        return Response({"error": "array must be a list"}, status=400)

    if not data:
        return Response({"error": "array cannot be empty"}, status=400)

    try:
        numbers = [int(value) for value in data]
    except (ValueError, TypeError):
        return Response(
            {"error": "array must contain only numbers"},
            status=400
        )

    result = selection_sort_steps(numbers)
    return Response(result)
