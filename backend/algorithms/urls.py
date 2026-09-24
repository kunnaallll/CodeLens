from django.urls import path
from .views import AlgorithmListCreateView, AlgorithmDetailView


urlpatterns = [
    path('', AlgorithmListCreateView.as_view(), name='algorithm-list'),
    path('<int:pk>/', AlgorithmDetailView.as_view(), name='algorithm-detail'),
]