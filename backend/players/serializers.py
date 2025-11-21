from rest_framework import serializers
from .models import PlayerProfile


class PlayerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerProfile
        fields = ['user', 'city', 'favorite_sport', 'level', 'position']
        read_only_fields = ['user']