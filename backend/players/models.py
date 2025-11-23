from django.db import models
from accounts.models import User

class PlayerProfile(models.Model):
    """Profil étendu pour les joueurs"""
    
    LEVEL_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
    ]
    
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name="player_profile"
    )
    city = models.CharField(max_length=100, blank=True)
    favorite_sport = models.CharField(max_length=50, blank=True)
    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES,
        default='beginner',
    )
    position = models.CharField(
        max_length=255,
        blank=True,
        help_text="Exemple : Soir, Week-end, Lundi/Jeudi..."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'player_profiles'
        verbose_name = 'Profil Joueur'
        verbose_name_plural = 'Profils Joueurs'

    def __str__(self):
        return f"Profil joueur de {self.user.full_name}"