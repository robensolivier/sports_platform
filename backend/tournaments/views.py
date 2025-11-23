from rest_framework import generics # Removed permissions
from .models import Tournament, Team # Import Team model
from .serializers import TournamentSerializer, TeamSerializer # Import TeamSerializer

class TournamentList(generics.ListAPIView):
    queryset = Tournament.objects.all() # Reverted to all
    serializer_class = TournamentSerializer

class TeamList(generics.ListCreateAPIView): # Changed to ListCreateAPIView
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class TeamDetail(generics.RetrieveAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer