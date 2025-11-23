from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from accounts.models import User
from .models import OrganizerProfile
from .serializers import OrganizerProfileSerializer


class OrganizerProfileView(APIView):
    """
    Endpoint profil organisateur.

    POST /organizers/profile/      -> créer / mettre à jour le profil
    GET  /organizers/profile/?clerk_id=xxx -> récupérer le profil
    """

    permission_classes = [permissions.AllowAny]

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
                {"detail": "User inexistant pour ce clerk_id"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def get(self, request):
        clerk_id = request.query_params.get("clerk_id")
        user, error_response = self.get_user_from_clerk_id(clerk_id)
        if error_response:
            return error_response

        try:
            profile = OrganizerProfile.objects.get(user=user)
        except OrganizerProfile.DoesNotExist:
            return Response(
                {"detail": "Profil organisateur non trouvé pour cet utilisateur"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = OrganizerProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Body attendu :
        {
          "clerk_id": "user_xxx",
          "organization_name": "...",
          "city": "...",
          "phone": "...",
          "bio": "..."
        }
        """
        clerk_id = request.data.get("clerk_id")
        user, error_response = self.get_user_from_clerk_id(clerk_id)
        if error_response:
            return error_response

        if user.role != "organizer":
            return Response(
                {"detail": "Cet utilisateur n'a pas le rôle 'organizer'"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profile, created = OrganizerProfile.objects.get_or_create(user=user)

        data = request.data.copy()
        data.pop("clerk_id", None)

        serializer = OrganizerProfileSerializer(profile, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
