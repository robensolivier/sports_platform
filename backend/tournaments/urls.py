from django.urls import path
from .views import TournamentList, TournamentDetail, TeamList, TeamDetail

urlpatterns = [
    path('', TournamentList.as_view(), name='tournament-list'),
    path('<uuid:pk>/', TournamentDetail.as_view(), name='tournament-detail'),
    path('teams/', TeamList.as_view(), name='team-list'),
    path('teams/<uuid:pk>/', TeamDetail.as_view(), name='team-detail'),
]
