from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Tournament, Team
from .serializers import TournamentSerializer, TeamSerializer
from accounts.models import User

# ------------------ TOURNAMENTS ------------------ #

class TournamentListCreateView(APIView):
    def get(self, request):
        tournaments = Tournament.objects.all()
        serializer = TournamentSerializer(tournaments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        clerk_id = request.data.get("clerk_id")
        try:
            user = User.objects.get(clerk_id=clerk_id)
        except User.DoesNotExist:
            return Response({"error": "Organisateur introuvable"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TournamentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(organizer=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TournamentDetailView(APIView):
    def get(self, request, tournament_id):
        tournament = get_object_or_404(Tournament, id=tournament_id)
        serializer = TournamentSerializer(tournament)
        return Response(serializer.data, status=status.HTTP_200_OK)

# ------------------ TEAMS ------------------ #

class TeamListCreateView(APIView):
    def get(self, request, tournament_id):
        tournament = get_object_or_404(Tournament, id=tournament_id)
        teams = Team.objects.filter(tournament=tournament)
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, tournament_id):
        tournament = get_object_or_404(Tournament, id=tournament_id)
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(tournament=tournament)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
