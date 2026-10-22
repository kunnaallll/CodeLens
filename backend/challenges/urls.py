
from django.urls import path
from .views import (
    AdminSubmissionListView,
    ChallengeDetailView,
    ChallengeListCreateView,
    ChallengeSubmissionView,
    QuestionAnswerView,
)


urlpatterns = [
    path('', ChallengeListCreateView.as_view(), name='challenge-list'),
    path('submissions/', AdminSubmissionListView.as_view(), name='admin-submission-list'),
    path('questions/<int:pk>/answer/', QuestionAnswerView.as_view(), name='question-answer'),
    path(
        '<int:pk>/submit/',
        ChallengeSubmissionView.as_view(),
        name='challenge-submit',
    ),
    path('<slug:slug>/', ChallengeDetailView.as_view(), name='challenge-detail'),
]
