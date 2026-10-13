from django.urls import path
<<<<<<< Updated upstream
from .views import AlgorithmListCreateView, AlgorithmDetailView, BubbleSortStepsView
=======
from .views import AlgorithmListCreateView, AlgorithmDetailView, selection_sort_visualization
>>>>>>> Stashed changes


urlpatterns = [
    path('bubble-sort/steps/', BubbleSortStepsView.as_view(), name='bubble-sort-steps'),
    path('', AlgorithmListCreateView.as_view(), name='algorithm-list'),
    path('<int:pk>/', AlgorithmDetailView.as_view(), name='algorithm-detail'),
<<<<<<< Updated upstream
]
=======
    path(
    "selection-sort/",
    selection_sort_visualization,
    name="selection-sort"
),
]
>>>>>>> Stashed changes
