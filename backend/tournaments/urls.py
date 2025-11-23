from django.urls import path
from .views import TournamentList

urlpatterns = [
    path('', TournamentList.as_view(), name='tournament-list'),
]
