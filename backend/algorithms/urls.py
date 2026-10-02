from django.urls import path
from .views import AlgorithmListCreateView, AlgorithmDetailView, BubbleSortStepsView


urlpatterns = [
    path('bubble-sort/steps/', BubbleSortStepsView.as_view(), name='bubble-sort-steps'),
    path('', AlgorithmListCreateView.as_view(), name='algorithm-list'),
    path('<int:pk>/', AlgorithmDetailView.as_view(), name='algorithm-detail'),
]
