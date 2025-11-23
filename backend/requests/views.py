from rest_framework.exceptions import PermissionDenied
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import JoinRequest
from .serializers import JoinRequestSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class JoinRequestViewSet(viewsets.ModelViewSet):
    queryset = JoinRequest.objects.all()
    serializer_class = JoinRequestSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        status_value = request.data.get('status')

        """Modification du statut à accepted"""
        if status_value == 'accepted':
            team = obj.team
            # Vérifier que seul l'organisateur peut modifier le statut
            if team.tournament.organizer != request.user:
                return Response({'erreur': "Seul l'organisateur de l'équipe peut accepter la demande."}, status=status.HTTP_403_FORBIDDEN)
            # Vérifier que l'équipe n'est pas pleine
            if hasattr(team, 'max_capacity') and hasattr(team, 'current_capacity'):
                if team.current_capacity >= team.max_capacity:
                    return Response({'erreur': "L'équipe est déjà pleine."}, status=status.HTTP_400_BAD_REQUEST)
                # Ajouter le joueur à l'équipe
                if hasattr(team, 'members'):
                    team.members.add(obj.player)
                team.save()
            # Changer le statut de la demande
            obj.status = 'accepted'
            obj.save()
            serializer = self.get_serializer(obj)
            return Response(serializer.data)
        
        """Modification du statut à rejected"""
        if status_value == 'rejected':
            team = obj.team
            # Vérifier que seul l'organisateur peut modifier le statut
            if team.tournament.organizer != request.user:
                return Response({'erreur': "Seul l'organisateur de l'équipe peut refuser la demande."}, status=status.HTTP_403_FORBIDDEN)
            reason = request.data.get('message')
            if reason:
                obj.message = reason
            obj.status = 'rejected'
            obj.save()
            serializer = self.get_serializer(obj)
            return Response(serializer.data)

        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='my-requests')
    def my_requests(self, request):
        user = request.user
        queryset = self.get_queryset().filter(player=user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
        
    """
    ViewSet pour gérer les demandes d'adhésion aux équipes.
    
    list: Récupère toutes les demandes
    create: Crée une nouvelle demande
    retrieve: Récupère une demande spécifique
    update: Met à jour une demande
    destroy: Supprime une demande
    """
    
    def get_queryset(self):
        """Filtrer les demandes selon l'équipe"""
        queryset = super().get_queryset()
        team_id = self.request.query_params.get('team')
        if team_id:
            queryset = queryset.filter(team_id=team_id)
        return queryset
    
    def perform_create(self, serializer):
        """Assigner automatiquement le joueur lors de la création, seulement si l'utilisateur est un joueur"""
        user = self.request.user
        # Vérifie que l'utilisateur a le rôle joueur
        if getattr(user, 'role', None) != 'player':
            raise PermissionDenied("Seuls les joueurs peuvent faire une demande d'adhésion.")
        serializer.save(player=user)

    def destroy(self, request, *args, **kwargs):
        """Supprimer une demande d'adhésion en attente"""
        obj = self.get_object()
        user = request.user
        if obj.player == user and obj.status == "pending":
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'L\'utilisateur peut uniquement supprimer ses propres demandes avec le status en attente'}, status=status.HTTP_403_FORBIDDEN)