from django.db import models
from accounts.models import User


class OrganizerProfile(models.Model):
    """Profil étendu pour les organisateurs (organizer)"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization_name = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    bio = models.TextField(blank=True)

    class Meta:
        db_table = "organizer_profiles"

    def __str__(self):
        return f"Profil organisateur de {self.user.full_name}"
