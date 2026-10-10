from django.urls import path
from .views import ProgressListCreateView, RecordProgressView


urlpatterns = [
    path('record/', RecordProgressView.as_view(), name='progress-record'),
    path('', ProgressListCreateView.as_view(), name='progress-list'),
]
