"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

from algorithms.views import DataStructureDetailView, DataStructureListCreateView
from .views import home

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/algorithms/', include('algorithms.urls')),
    path('api/progress/', include('progress.urls')),
    path('api/challenges/', include('challenges.urls')),
    path('api/data-structures/', DataStructureListCreateView.as_view(), name='data-structure-list'),
    path('api/data-structures/<str:lookup>/', DataStructureDetailView.as_view(), name='data-structure-detail'),
    path('api/analytics/', include('analytics.urls')),
    path('api/achievements/', include('progress.achievement_urls')),
    path('api/scores/', include('progress.score_urls')),
]
