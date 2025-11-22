from django.utils import timezone
from rest_framework import serializers
from .models import Match


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['id', 'team_a', 'team_b', 'date', 'location', 'score_a', 'score_b', 'created_at']
        read_only_fields = ['id', 'created_at']

    # Validation des champs
    def validate_score_a(self, score):
        """Valider que le score de l'équipe A est positif"""
        if score is not None and score < 0:
            raise serializers.ValidationError("Le score ne peut pas être négatif.")
        return score

    def validate_score_b(self, score):
        """Valider que le score de l'équipe B est positif"""
        if score is not None and score < 0:
            raise serializers.ValidationError("Le score ne peut pas être négatif.")
        return score

    def validate_date(self, date):
        """Valider que la date du match n'est pas dans le passé"""
        if date < timezone.now():
            raise serializers.ValidationError("La date du match ne peut pas être dans le passé.")
        return date

    def validate_location(self, location):
        """Valider que le lieu n'est pas vide"""
        if not location or not location.strip():
            raise serializers.ValidationError("Le lieu du match est obligatoire.")
        return location.strip()

    def validate(self, data):
        """Validation globale du match"""
        # Vérifier que les équipes sont différentes
        if data.get('team_a') == data.get('team_b'):
            raise serializers.ValidationError("Une équipe ne peut pas jouer contre elle-même.")
        
        # Vérifier que si un score est défini, l'autre l'est aussi
        score_a = data.get('score_a')
        score_b = data.get('score_b')
        if (score_a is not None) != (score_b is not None):
            raise serializers.ValidationError("Les deux scores doivent être définis ensemble ou pas du tout.")
        
        return data