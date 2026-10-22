from django.urls import path

from .views import MyScoresListView


urlpatterns = [
    path('', MyScoresListView.as_view(), name='score-list'),
]
