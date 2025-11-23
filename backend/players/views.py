# players/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from accounts.models import User
from .models import PlayerProfile
from .serializers import PlayerProfileSerializer


class PlayerListView(APIView):
    """
    Endpoint for listing all players.
    GET /players/ -> list all players
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        players = PlayerProfile.objects.all()
        serializer = PlayerProfileSerializer(players, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PlayerProfileView(APIView):
    """
    Endpoint profil joueur.

    POST /players/profile/            -> créer / mettre à jour le profil
    GET  /players/profile/?clerk_id= -> récupérer le profil d’un joueur
    """

    # Pour les tests Postman, on laisse tout ouvert
    permission_classes = [permissions.AllowAny]

    # ------------------ utilitaire ------------------ #
    def get_user_from_clerk_id(self, clerk_id: str):
        if not clerk_id:
            return None, Response(
                {"detail": "clerk_id est requis"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(clerk_id=clerk_id)
            return user, None
        except User.DoesNotExist:
            return None, Response(
                {"detail": "Aucun utilisateur trouvé pour ce clerk_id"},
                status=status.HTTP_404_NOT_FOUND,
            )

    # ----------------------- GET --------------------- #
    def get(self, request):
        clerk_id = request.query_params.get("clerk_id")
        user, error_response = self.get_user_from_clerk_id(clerk_id)
        if error_response:
            return error_response

        try:
            profile = PlayerProfile.objects.get(user=user)
        except PlayerProfile.DoesNotExist:
            return Response(
                {"detail": "Profil joueur inexistant pour cet utilisateur"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PlayerProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ----------------------- POST -------------------- #
    def post(self, request):
        """
        Body attendu :
        {
          "clerk_id": "user_12345",
          "city": "...",
          "favorite_sport": "...",
          "level": "beginner/intermediate/advanced",
          "position": "Soir, Week-end...",
          "bio": "..."
        }
        """
        clerk_id = request.data.get("clerk_id")
        user, error_response = self.get_user_from_clerk_id(clerk_id)
        if error_response:
            return error_response

        # vérifier que c’est bien un joueur
        if user.role != "player":
            return Response(
                {"detail": "Cet utilisateur n'a pas le rôle 'player'"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # récupérer ou créer le profil
        profile, created = PlayerProfile.objects.get_or_create(user=user)

        # enlever clerk_id (pas un champ du modèle)
        data = request.data.copy()
        data.pop("clerk_id", None)

        serializer = PlayerProfileSerializer(instance=profile, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
