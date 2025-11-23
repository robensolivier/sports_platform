from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import JoinRequest
from .serializers import JoinRequestSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class JoinRequestViewSet(viewsets.ModelViewSet):

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
    queryset = JoinRequest.objects.all()
    serializer_class = JoinRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filtrer les demandes selon l'utilisateur"""
        user = self.request.user
        # Vous pouvez ajouter une logique pour filtrer par utilisateur
        return JoinRequest.objects.all()
    
    def perform_create(self, serializer):
        """Assigner automatiquement le joueur lors de la création"""
        # Assigne automatiquement l'utilisateur connecté comme joueur
        serializer.save(player=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """Supprimer une demande d'adhésion en attente"""
        obj = self.get_object()
        user = request.user
        if obj.player == user and obj.status == "pending":
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'erreur': 'L\'utilisateur peut uniquement supprimer ses propres demandes avec le status en attente'}, status=status.HTTP_403_FORBIDDEN)

