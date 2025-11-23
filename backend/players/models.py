from django.contrib.auth.models import User
from django.db import models
from accounts.models import User


class PlayerProfile(models.Model):
    """Profil étendu pour les joueurs"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=100)
    favorite_sport = models.CharField(max_length=50)
    level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Débutant'),
            ('intermediate', 'Intermédiaire'),
            ('advanced', 'Avancé'),
        ],
        default='beginner',
    )
    position = models.CharField(
        max_length=255,
        blank=True,
        help_text="Exemple : Soir, Week-end, Lundi/Jeudi..."
    )
    bio = models.TextField(blank=True)

    class Meta:
        db_table = 'player_profiles'

    def __str__(self):
        return f"Profil joueur de {self.user.full_name}"