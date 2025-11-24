# backend/accounts/tests.py

import json
import uuid

from django.test import TestCase, Client
from django.urls import reverse

from .models import User


class RegisterViewTests(TestCase):
    """
    Tests pour l'endpoint:
    POST /accounts/auth/register/

    On vérifie :
    - Création d'un nouvel utilisateur
    - Mise à jour d'un utilisateur existant
    - Erreur si role invalide
    """

    def setUp(self):
        self.client = Client()
        # Tu peux utiliser reverse si tu as bien un name="auth-register" dans accounts/urls.py
        # self.url = reverse("auth-register")
        self.url = "/accounts/auth/register/"

    def test_register_creates_new_user(self):
        """Un nouvel appel avec un clerk_id inconnu doit créer un user (201 + created=True)."""
        payload = {
            "clerk_id": "user_123",
            "email": "player@example.com",
            "full_name": "Test Player",
            "role": "player",
        }

        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        data = response.json()

        # Le flag "created" doit être True
        self.assertTrue(data.get("created"))

        # Vérifier que l'utilisateur a bien été créé en BDD
        self.assertTrue(
            User.objects.filter(clerk_id="user_123").exists()
        )
        user = User.objects.get(clerk_id="user_123")
        self.assertEqual(user.email, payload["email"])
        self.assertEqual(user.full_name, payload["full_name"])
        self.assertEqual(user.role, payload["role"])

    def test_register_updates_existing_user(self):
        """
        Si le clerk_id existe déjà, l'endpoint doit mettre à jour
        les infos et renvoyer 200 + created=False.
        """
        user = User.objects.create(
            id=uuid.uuid4(),
            clerk_id="user_456",
            email="old@example.com",
            full_name="Ancien Nom",
            role="player",
        )

        payload = {
            "clerk_id": "user_456",  # même clerk_id
            "email": "new@example.com",
            "full_name": "Nouveau Nom",
            "role": "organizer",
        }

        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Le flag "created" doit être False (user déjà existant)
        self.assertFalse(data.get("created"))

        # Recharger l'utilisateur depuis la BDD
        user.refresh_from_db()
        self.assertEqual(user.email, payload["email"])
        self.assertEqual(user.full_name, payload["full_name"])
        self.assertEqual(user.role, payload["role"])

    def test_register_invalid_role_returns_400(self):
        """
        Si on envoie un role invalide (pas 'player' ou 'organizer'),
        le serializer doit renvoyer une erreur 400.
        """
        payload = {
            "clerk_id": "user_789",
            "email": "test@example.com",
            "full_name": "Bad Role",
            "role": "admin",  # rôle invalide
        }

        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        data = response.json()
        # On s'attend à une erreur sur le champ "role"
        self.assertIn("role", data)
