from django.db import models
from django.contrib.auth.models import User

class Player(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='player_profile')
    full_name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    main_sport = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    preferred_position = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.full_name or self.user.username