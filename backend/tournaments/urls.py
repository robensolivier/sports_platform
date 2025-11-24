from django.urls import path
from .views import TournamentListCreateView, TournamentDetailView, TeamListCreateView

urlpatterns = [
    path('', TournamentListCreateView.as_view(), name='tournament-list-create'),
    path('<uuid:id>/', TournamentDetailView.as_view(), name='tournament-detail'),
    path('<uuid:tournament_id>/teams/', TeamListCreateView.as_view(), name='team-list-create'),
]
