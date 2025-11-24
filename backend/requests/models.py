import uuid
from django.db import models


class JoinRequest(models.Model):
    """Demande d'adhésion à une équipe"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('accepted', 'Accepté'),
        ('rejected', 'Refusé')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    player = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='join_requests')
    team = models.ForeignKey('tournaments.Team', on_delete=models.CASCADE, related_name='join_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'join_requests'
        unique_together = ['player', 'team'] #  Une seule demande par joueur/equipe