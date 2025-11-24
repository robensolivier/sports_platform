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
    members_count = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'sport', 'members', 'members_count']
        read_only_fields = ['id', 'members_count', 'members']

    def get_members_count(self, obj):
        return obj.members.count()

    def get_members(self, obj):
        # Retourne la liste des ids des membres
        return [str(member.id) for member in obj.members.all()]

    def create(self, validated_data):
        # Call the original create method
        instance = super().create(validated_data)
        return instance

    # Validation des champs
    def validate_name(self, name):
        """Valider que le nom de l'équipe n'est pas vide"""
        if not name or not name.strip():
            raise serializers.ValidationError("Le nom de l'équipe est obligatoire.")
        return name.strip()

    def validate_sport(self, sport):
        """Valider que le sport n'est pas vide"""
        if not sport or not sport.strip():
            raise serializers.ValidationError("Le sport est obligatoire.")
        return sport.strip()