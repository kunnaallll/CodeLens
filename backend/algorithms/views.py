from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Algorithm
from .serializers import AlgorithmSerializer
<<<<<<< Updated upstream
from .bubble_sort import bubble_sort_steps
=======
from .selection_sort import selection_sort_steps
from rest_framework.decorators import api_view
from rest_framework.response import Response
>>>>>>> Stashed changes


class AlgorithmListCreateView(generics.ListCreateAPIView):
    queryset = Algorithm.objects.all()
    serializer_class = AlgorithmSerializer


class AlgorithmDetailView(generics.RetrieveAPIView):
    queryset = Algorithm.objects.all()
    serializer_class = AlgorithmSerializer
<<<<<<< Updated upstream


class BubbleSortStepsView(APIView):
    """Expose Sayee's step generator to the React visualizer."""

    def post(self, request):
        values = request.data.get('array')
        if not isinstance(values, list) or not all(
            isinstance(value, (int, float)) and not isinstance(value, bool)
            for value in values
        ):
            return Response({'array': 'Provide an array of numbers.'}, status=400)
        return Response(bubble_sort_steps(values))
=======
@api_view(["POST"])
def selection_sort_visualization(request):
    data = request.data.get("array")

    if not isinstance(data, list):
        return Response(
            {"error": "array must be a list"},
            status=400
        )

    if len(data) == 0:
        return Response(
            {"error": "array cannot be empty"},
            status=400
        )

    try:
        numbers = [int(value) for value in data]
    except (ValueError, TypeError):
        return Response(
            {"error": "array must contain only numbers"},
            status=400
        )

    result = selection_sort_steps(numbers)

    return Response(result)    
>>>>>>> Stashed changes
