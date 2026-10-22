from django.urls import path
from .views import (
    LeaderboardView,
    ProgressListCreateView,
    ProgressSummaryView,
    RecordProgressView,
)


urlpatterns = [
    path('summary/', ProgressSummaryView.as_view(), name='progress-summary'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('record/', RecordProgressView.as_view(), name='progress-record'),
    path('', ProgressListCreateView.as_view(), name='progress-list'),
]
