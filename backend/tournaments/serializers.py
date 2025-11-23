from django.utils import timezone
from rest_framework import serializers
from .models import Tournament, Team


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'sport', 'city', 'start_date', 'organizer', 'created_at']
        read_only_fields = ['id', 'organizer', 'created_at']

    # Validation des champs
    def validate_name(self, name):
        """Valider que le nom du tournoi n'est pas vide"""
        if not name or not name.strip():
            raise serializers.ValidationError("Le nom du tournoi est obligatoire.")
        return name.strip()
    
    def validate_sport(self, sport):
        """Valider que le sport n'est pas vide"""
        if not sport or not sport.strip():
            raise serializers.ValidationError("Le sport est obligatoire.")
        return sport.strip()
    
    def validate_city(self, city):
        """Valider que la ville n'est pas vide"""
        if not city or not city.strip():
            raise serializers.ValidationError("La ville est obligatoire.")
        return city.strip()
    
    def validate_start_date(self, start_date):
        """Valider que la date de début n'est pas dans le passé"""
        if start_date < timezone.now().date():
            raise serializers.ValidationError("La date de début ne peut pas être dans le passé.")
        return start_date


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'tournament', 'max_capacity', 'current_capacity', 'members', 'created_at']
        read_only_fields = ['id', 'created_at']

    # Validation des champs
    def validate_name(self, name):
        """Valider que le nom de l'équipe n'est pas vide"""
        if not name or not name.strip():
            raise serializers.ValidationError("Le nom de l'équipe est obligatoire.")
        return name.strip()
    
    def validate_max_capacity(self, max_capacity):
        """Valider que la capacité maximale est positive et raisonnable"""
        if max_capacity <= 0:
            raise serializers.ValidationError("La capacité maximale doit être positive.")
        if max_capacity > 100:
            raise serializers.ValidationError("La capacité maximale ne peut pas dépasser 100 joueurs.")
        return max_capacity
    
    def validate_current_capacity(self, current_capacity):
        """Valider que la capacité actuelle n'est pas négative"""
        if current_capacity < 0:
            raise serializers.ValidationError("La capacité actuelle ne peut pas être négative.")
        return current_capacity
    
    def validate(self, data):
        """Validation globale de l'équipe"""
        max_capacity = data.get('max_capacity')
        current_capacity = data.get('current_capacity')
        tournament = data.get('tournament')
        
        # Vérifier que le tournoi existe
        if not tournament:
            raise serializers.ValidationError("Le tournoi doit exister.")
        
        # Vérifier que la capacité actuelle ne dépasse pas la maximale
        if max_capacity and current_capacity and current_capacity > max_capacity:
            raise serializers.ValidationError("La capacité actuelle ne peut pas dépasser la capacité maximale.")
        
        return data