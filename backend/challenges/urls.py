
from django.urls import path
from .views import ChallengeListCreateView, ChallengeSubmissionView


urlpatterns = [
    path('', ChallengeListCreateView.as_view(), name='challenge-list'),
    path(
        '<int:pk>/submit/',
        ChallengeSubmissionView.as_view(),
        name='challenge-submit',
    ),
]
