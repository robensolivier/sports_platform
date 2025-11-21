from django.contrib.auth.models import User
from django.db import models


class PlayerProfile(models.Model):
    """Profil étendu pour les joueurs"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=100)
    favorite_sport = models.CharField(max_length=50)
    level = models.CharField(max_length=20, choices=[
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé')
    ])
    position = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = 'player_profiles'