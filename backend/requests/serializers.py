from rest_framework import serializers
from .models import JoinRequest


class JoinRequestSerializer(serializers.ModelSerializer):
    tournament_name = serializers.CharField(source='team.tournament.name', read_only=True)

    class Meta:
        model = JoinRequest
        fields = ['id', 'player', 'team', 'tournament_name', 'status', 'message', 'created_at', 'updated_at']
        read_only_fields = ['id', 'status', 'player', 'created_at', 'updated_at']

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
        team = data.get('team')
        if self.instance:
            player = data.get('player') or getattr(self.instance, 'player', None)
            if not player:
                raise serializers.ValidationError("Le joueur doit exister.")
        else:
            player = data.get('player')
        # Vérifier que l'équipe existe
        if not team:
            raise serializers.ValidationError("L'équipe doit exister.")
        # Vérifier qu'un joueur ne fait pas une demande pour rejoindre sa propre équipe
        if player and team and hasattr(team, 'members') and player in team.members.all():
            raise serializers.ValidationError("Ce joueur fait déjà partie de cette équipe.")
        # Vérifier que l'équipe n'est pas pleine
        if team and team.is_full:
            raise serializers.ValidationError("Cette équipe est déjà complète.")
        # Vérifier qu'il n'y a pas déjà une demande en attente pour ce joueur/équipe
        if self.instance is None and player:
            existing_request = JoinRequest.objects.filter(
                player=player,
                team=team,
                status='pending'
            ).exists()
            if existing_request:
                raise serializers.ValidationError("Une demande est déjà en attente pour ce joueur et cette équipe.")
        return data