from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Algorithm
from .serializers import AlgorithmSerializer
from .bubble_sort import bubble_sort_steps


class AlgorithmListCreateView(generics.ListCreateAPIView):
    queryset = Algorithm.objects.all()
    serializer_class = AlgorithmSerializer


class AlgorithmDetailView(generics.RetrieveAPIView):
    queryset = Algorithm.objects.all()
    serializer_class = AlgorithmSerializer


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
