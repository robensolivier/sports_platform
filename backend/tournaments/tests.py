from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Tournament, Team
from accounts.models import User  # si ton app users s’appelle accounts


class TournamentViewSetTests(APITestCase):

    def setUp(self):
        # Crée un utilisateur fictif
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="testpass123",
            full_name="Test User"
        )

        # Endpoint de base
        self.tournaments_url = reverse('tournament-list')

    def test_create_tournament(self):
        """Test création d’un tournoi via API"""
        data = {
            "name": "Tournoi Test",
            "sport": "Football",
            "city": "Paris",
            "start_date": "2025-12-01",
            "organizer": self.user.id
        }
        response = self.client.post(self.tournaments_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tournament.objects.count(), 1)
        self.assertEqual(Tournament.objects.get().name, "Tournoi Test")

    def test_get_tournaments_list(self):
        """Test récupération de la liste des tournois"""
        Tournament.objects.create(
            name="Tournoi 1",
            sport="Tennis",
            city="Lyon",
            start_date="2025-05-01",
            organizer=self.user
        )
        response = self.client.get(self.tournaments_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)


class TeamViewSetTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="teamuser@example.com",
            password="testpass123",
            full_name="Team User"
        )
        self.tournament = Tournament.objects.create(
            name="Tournoi Test",
            sport="Football",
            city="Paris",
            start_date="2025-12-01",
            organizer=self.user
        )
        self.teams_url = reverse('team-list')

    def test_create_team(self):
        """Test création d’une équipe dans un tournoi"""
        data = {
            "name": "Les Lions",
            "tournament": str(self.tournament.id),
            "members": [str(self.user.id)]
        }
        response = self.client.post(self.teams_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 1)
        self.assertEqual(Team.objects.get().name, "Les Lions")

    def test_get_teams(self):
        """Test récupération de la liste des équipes"""
        Team.objects.create(
            name="Les Tigres",
            tournament=self.tournament
        )
        response = self.client.get(self.teams_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
