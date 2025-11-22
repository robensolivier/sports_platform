from rest_framework import serializers
from .models import JoinRequest


class JoinRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinRequest
        fields = ['id', 'player', 'team', 'status', 'message', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    # Validation des champs
    def validate_status(self, status):
        """Valider que le statut est correct"""
        valid_statuses = ['pending', 'accepted', 'rejected']
        if status not in valid_statuses:
            raise serializers.ValidationError("Le statut doit être 'pending', 'accepted' ou 'rejected'.")
        return status
    
    def validate_message(self, message):
        """Valider le message (optionnel mais si fourni, ne doit pas être que des espaces)"""
        if message and message.strip() == "":
            raise serializers.ValidationError("Si un message est fourni, il ne peut pas être vide.")
        return message.strip() if message else ""
    
    def validate(self, data):
        """Validation globale de la demande"""
        player = data.get('player')
        team = data.get('team')
        
        # Vérifier que le joueur et l'équipe existent
        if not player:
            raise serializers.ValidationError("Le joueur doit exister.")
        if not team:
            raise serializers.ValidationError("L'équipe doit exister.")
        
        # Vérifier qu'un joueur ne fait pas une demande pour rejoindre sa propre équipe
        if team and hasattr(team, 'members') and player in team.members.all():
            raise serializers.ValidationError("Ce joueur fait déjà partie de cette équipe.")
        
        # Vérifier qu'il n'y a pas déjà une demande en attente pour ce joueur/équipe
        if self.instance is None:  # Création (pas mise à jour)
            existing_request = JoinRequest.objects.filter(
                player=player, 
                team=team, 
                status='pending'
            ).exists()
            if existing_request:
                raise serializers.ValidationError("Une demande est déjà en attente pour ce joueur et cette équipe.")
        
        return data