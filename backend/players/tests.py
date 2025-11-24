# players/tests.py
from django.test import TestCase, Client
from django.urls import reverse

from accounts.models import User
from players.models import PlayerProfile
import json


class PlayerProfileTests(TestCase):
    def setUp(self):
        # Client HTTP de Django
        self.client = Client()

        # Utilisateur joueur de base
        self.player_user = User.objects.create(
            clerk_id="user_54321",
            email="sawsen@example.com",
            full_name="Sawsen Klai",
            role="player",
        )

        # URL de l’endpoint profil joueur
        self.url = reverse("player-profile")

    def test_create_player_profile(self):
        """Création d'un profil joueur via POST /players/profile/"""

        payload = {
            "clerk_id": self.player_user.clerk_id,
            "city": "Montreal",
            "favorite_sport": "Football",
            "level": "intermediate",
            "position": "Rue 4587",
            "bio": "Je cherche des matchs amicaux.",
        }

        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )

        # Création -> 201 ou 200 (suivant get_or_create)
        self.assertIn(response.status_code, [200, 201])

        data = response.json()
        self.assertEqual(data["city"], "Montreal")
        self.assertEqual(data["favorite_sport"], "Football")
        self.assertEqual(data["level"], "intermediate")
        self.assertEqual(data["email"], self.player_user.email)

        # Vérifier que le profil existe en base
        profile = PlayerProfile.objects.get(user=self.player_user)
        self.assertEqual(profile.city, "Montreal")

    def test_update_player_profile(self):
        """Mise à jour d'un profil joueur existant"""

        # Profil déjà existant
        PlayerProfile.objects.create(
            user=self.player_user,
            city="Laval",
            favorite_sport="Basket",
            level="beginner",
            position="Week-end",
            bio="Ancien profil",
        )

        payload = {
            "clerk_id": self.player_user.clerk_id,
            "city": "Montreal",
            "favorite_sport": "Football",
            "level": "advanced",
            "position": "En semaine",
            "bio": "Nouveau profil",
        }

        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)

        profile = PlayerProfile.objects.get(user=self.player_user)
        self.assertEqual(profile.city, "Montreal")
        self.assertEqual(profile.level, "advanced")
        self.assertEqual(profile.bio, "Nouveau profil")

    def test_cannot_create_profile_for_non_player(self):
        """Un user qui n'a pas le rôle 'player' ne doit pas pouvoir créer de profil joueur"""

        organizer = User.objects.create(
            clerk_id="org_999",
            email="orga@example.com",
            full_name="Organisateur",
            role="organizer",
        )

        payload = {
            "clerk_id": organizer.clerk_id,
            "city": "Montreal",
            "favorite_sport": "Tennis",
            "level": "beginner",
            "position": "Samedi",
            "bio": "Je ne suis pas un joueur",
        }

        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )

        # Ton endpoint renvoie 400 pour un rôle ≠ 'player'
        self.assertEqual(response.status_code, 400)
