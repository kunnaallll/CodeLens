from django.urls import path

from .views import AchievementDetailView, AchievementListCreateView


urlpatterns = [
    path('', AchievementListCreateView.as_view(), name='achievement-list'),
    path('<slug:code>/', AchievementDetailView.as_view(), name='achievement-detail'),
]
