from rest_framework import serializers
from .models import Tournament, Team


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'sport', 'city', 'start_date', 'organizer', 'created_at']
        read_only_fields = ['id', 'created_at']


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'tournament', 'max_capacity', 'current_capacity', 'members', 'created_at']
        read_only_fields = ['id', 'created_at']