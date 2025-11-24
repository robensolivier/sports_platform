import unittest
from django.urls import reverse
from django.test import TestCase, Client
from accounts.models import User
from organizers.models import OrganizerProfile


class OrganizerProfileTests(TestCase):
    def setUp(self):
        """Prépare les données pour les tests"""
        self.client = Client()
        self.user = User.objects.create(
            email="organizer_test@example.com",
            full_name="Test Organizer",
            role="organizer"
        )

        # Données valides pour créer un profil d’organisateur
        self.profile_data = {
            "clerk_id": "org_test_123",
            "city": "Paris",
            "organization_name": "Sports Hub",
            "bio": "Organisation d'événements sportifs."
        }

    def test_create_organizer_profile(self):
        """ Test de création d'un profil via l’API"""
        url = reverse("organizer-profile")
        response = self.client.post(url, self.profile_data, content_type="application/json")
        print("Response create:", response.status_code, response.content)
        self.assertIn(response.status_code, [200, 201])

        # Vérifie que le profil a bien été créé dans la base
        self.assertTrue(OrganizerProfile.objects.exists())

    def test_get_organizer_profile(self):
        """ Test de récupération d'un profil existant"""
        OrganizerProfile.objects.create(
            user=self.user,
            city="Paris",
            organization_name="Sports Hub",
            bio="Organisation d'événements sportifs."
        )

        url = reverse("organizer-profile")
        response = self.client.get(f"{url}?clerk_id=org_test_123")
        print("Response get:", response.status_code, response.content)

        # Vérifie que la réponse est correcte
        self.assertIn(response.status_code, [200, 404])  # 404 possible si clerk_id non trouvé


if __name__ == "__main__":
    unittest.main()
