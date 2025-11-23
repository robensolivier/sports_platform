from django.utils import timezone
from rest_framework import serializers
from .models import Match
from tournaments.serializers import TeamSerializer


class MatchSerializer(serializers.ModelSerializer):
    team_a = TeamSerializer(read_only=True)
    team_b = TeamSerializer(read_only=True)

    def validate(self, data):
        request = self.context.get('request')
        # PATCH: autoriser la modification de la date, du lieu et des scores (après le match uniquement)
        if request and request.method == 'PATCH':
            allowed_fields = {'date', 'location', 'score_a', 'score_b'}
            forbidden_fields = set(data.keys()) - allowed_fields
            if forbidden_fields:
                raise serializers.ValidationError(
                    f"Seuls les champs 'date', 'location' et les scores peuvent être modifiés. Champs non autorisés: {', '.join(forbidden_fields)}"
                )
            # Si on modifie les scores, vérifier que le match est passé
            if ('score_a' in data or 'score_b' in data):
                instance = getattr(self, 'instance', None)
                match_date = instance.date if instance else data.get('date')
                if match_date and timezone.now() < match_date:
                    raise serializers.ValidationError("Les scores ne peuvent être saisis qu'après le match.")
            return data
        # Validation globale du match
        if data.get('team_a') == data.get('team_b'):
            raise serializers.ValidationError("Une équipe ne peut pas jouer contre elle-même.")
        score_a = data.get('score_a')
        score_b = data.get('score_b')
        if (score_a is not None) != (score_b is not None):
            raise serializers.ValidationError("Les deux scores doivent être définis ensemble ou pas du tout.")
        team_a = data.get('team_a')
        team_b = data.get('team_b')
        date = data.get('date')
        if team_a and team_b and date:
            exists = Match.objects.filter(
                team_a=team_a,
                team_b=team_b,
                date=date
            ).exists()
            if exists:
                raise serializers.ValidationError("Un match entre ces deux équipes existe déjà à cette date et heure.")
        return data

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