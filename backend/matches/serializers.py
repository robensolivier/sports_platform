from rest_framework import serializers
from .models import Match


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['id', 'team_a', 'team_b', 'date', 'location', 'score_a', 'score_b', 'created_at']
        read_only_fields = ['id', 'created_at']