# accounts/views.py
from rest_framework import status, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer


class RegisterSerializer(serializers.Serializer):
    """
    Serializer utilisé UNIQUEMENT pour l'endpoint /auth/register/
    (on ne touche pas au fichier serializers.py de l'équipe)
    """
    clerk_id = serializers.CharField()
    email = serializers.EmailField()
    full_name = serializers.CharField()
    role = serializers.ChoiceField(choices=["player", "organizer"])


class RegisterView(APIView):
    """
    POST /accounts/auth/register/

    Appelé par le frontend APRÈS une inscription Clerk.
    Il crée (ou met à jour) l'utilisateur dans la BDD Django.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        # Création ou mise à jour du user
        user, created = User.objects.get_or_create(
            clerk_id=data["clerk_id"],
            defaults={
                "email": data["email"],
                "full_name": data["full_name"],
                "role": data["role"],
            },
        )

        if not created:
            # Met à jour les infos si l'user existe déjà
            user.email = data["email"]
            user.full_name = data["full_name"]
            user.role = data["role"]
            user.save()

        return Response(
            {
                "user": UserSerializer(user).data,
                "created": created,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class LoginView(APIView):
    """
    POST /accounts/auth/login/

    Version simplifiée pour le TP :
    - On reçoit simplement un `clerk_id` dans le body
    - On renvoie les infos du user si trouvé
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        clerk_id = request.data.get("clerk_id")
        if not clerk_id:
            return Response(
                {"detail": "clerk_id est requis"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(clerk_id=clerk_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User non trouvé pour ce clerk_id"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response({"user": UserSerializer(user).data}, status=status.HTTP_200_OK)


class VerifyTokenView(APIView):
    """
    POST /accounts/auth/verify-token/

    Pour l’instant (sans Clerk réel), on teste aussi avec un `clerk_id`
    envoyé dans le body. Plus tard, on pourra brancher le middleware Clerk.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        clerk_id = request.data.get("clerk_id")
        if not clerk_id:
            return Response(
                {"detail": "clerk_id est requis"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(clerk_id=clerk_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User non trouvé pour ce clerk_id"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response({"user": UserSerializer(user).data}, status=status.HTTP_200_OK)
