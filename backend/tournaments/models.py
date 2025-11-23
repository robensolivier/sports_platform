import uuid
from django.contrib.auth.models import User
from django.db import models



class Tournament(models.Model):
    """Tournoi/Ligue créé par un organisateur"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=200)
    sport = models.CharField(max_length=50)
    city = models.CharField(max_length=100)
    start_date = models.DateField()
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournaments')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.city}"

    class Meta:
        db_table = 'tournaments'


class Team(models.Model):
    """Équipe dans un tournoi"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=200)
    sport = models.CharField(max_length=50, default='Unknown') # Added sport field
    members = models.ManyToManyField(User, related_name='teams', blank=True)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        db_table = 'teams'