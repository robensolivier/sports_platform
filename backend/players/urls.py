from django.urls import path
from .views import PlayerProfileView, PlayerListView

urlpatterns = [
    path("", PlayerListView.as_view(), name="player-list"),
    path("profile/", PlayerProfileView.as_view(), name="player-profile"),
]