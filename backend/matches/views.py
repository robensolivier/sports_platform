from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from django.utils import timezone
from .models import Match
from .serializers import MatchSerializer
from tournaments.models import Team, Tournament

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        tournament_id = self.request.query_params.get('tournament')
        if tournament_id:
            try:
                tournament = Tournament.objects.get(pk=tournament_id)
            except Tournament.DoesNotExist:
                return queryset.none()
            if tournament.organizer != user:
                return queryset.none()
            queryset = queryset.filter(
                Q(team_a__tournament_id=tournament_id) | Q(team_b__tournament_id=tournament_id)
            )
        # Filtrer les matchs où l'utilisateur est membre de l'une des équipes
        elif user.is_authenticated:
            queryset = queryset.filter(
                Q(team_a__members=user) | Q(team_b__members=user)
            )
        # Filtrer par statut
        status = self.request.query_params.get('status')
        now = timezone.now()
        if status == 'upcoming':
            queryset = queryset.filter(date__gte=now)
        elif status == 'past':
            queryset = queryset.filter(date__lt=now)
        return queryset.distinct()

    def partial_update(self, request, *args, **kwargs):
        # Seul l'organisateur du tournoi peut modifier un match et saisir les scores
        instance = self.get_object()
        user = request.user
        tournament = instance.team_a.tournament
        if tournament.organizer != user:
            return Response({'detail': "Seul l'organisateur du tournoi peut modifier ce match."}, status=403)
        # Vérifier si on modifie les scores
        score_fields = {'score_a', 'score_b'}
        if any(field in request.data for field in score_fields):
            if timezone.now() < instance.date:
                return Response({'detail': "Les scores ne peuvent être saisis qu'après le match."}, status=400)
        return super().partial_update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # Seul l'organisateur du tournoi peut modifier un match (PUT est bloqué, mais on garde la sécurité)
        instance = self.get_object()
        user = request.user
        tournament = instance.team_a.tournament
        if tournament.organizer != user:
            return Response({'detail': "Seul l'organisateur du tournoi peut modifier ce match."}, status=403)
        return Response({'detail': 'Modification complète (PUT) interdite.'}, status=405)

    def destroy(self, request, *args, **kwargs):
        # Seul l'organisateur du tournoi peut supprimer un match
        instance = self.get_object()
        user = request.user
        tournament = instance.team_a.tournament
        if tournament.organizer != user:
            return Response({'detail': "Seul l'organisateur du tournoi peut supprimer ce match."}, status=403)
        instance.delete()
        return Response({'detail': 'Match supprimé.'})

    def perform_create(self, serializer):
        # Seul l'organisateur du tournoi peut créer un match
        user = self.request.user
        team_a = self.request.data.get('team_a')
        try:
            team_a_obj = Team.objects.get(pk=team_a)
        except Team.DoesNotExist:
            return  
        tournament = team_a_obj.tournament
        if tournament.organizer != user:
            raise PermissionDenied("Seul l'organisateur du tournoi peut créer un match.")
        serializer.save()