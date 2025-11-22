from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import JoinRequest
from .serializers import JoinRequestSerializer


class JoinRequestViewSet(viewsets.ModelViewSet):
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
        return JoinRequest.objects.all() # filter selon vos besoins
    
    def perform_create(self, serializer):
        """Assigner automatiquement le joueur lors de la création"""
        # Assigne automatiquement l'utilisateur connecté comme joueur
        serializer.save(player=self.request.user)
