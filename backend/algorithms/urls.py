from django.urls import path
from .views import (
    AlgorithmListCreateView, 
    AlgorithmDetailView, 
    BubbleSortStepsView, 
    selection_sort_visualization,
)

urlpatterns = [
    path('bubble-sort/steps/', BubbleSortStepsView.as_view(), name='bubble-sort-steps'),
    path('selection-sort/', selection_sort_visualization, name='selection-sort'),
    path('', AlgorithmListCreateView.as_view(), name='algorithm-list'),
    path('<str:lookup>/', AlgorithmDetailView.as_view(), name='algorithm-detail'),
]
