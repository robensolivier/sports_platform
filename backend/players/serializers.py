from rest_framework import serializers
from .models import PlayerProfile


class PlayerProfileSerializer(serializers.ModelSerializer):
    # Champs calculés à partir de la relation OneToOne vers User
    email = serializers.EmailField(source="user.email", read_only=True)
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)

    class Meta:
        model = PlayerProfile
        fields = [
            "id",
            "user",
            "email",
            "full_name",
            "role",
            "city",
            "favorite_sport",
            "level",
            "position",
            "bio",
        ]
        read_only_fields = [
            "id",
            "user",
            "email",
            "full_name",
            "role",
        ]

    # ---------- VALIDATIONS ----------

    def validate_city(self, city):
        """Valider que la ville n'est pas vide"""
        if not city or not city.strip():
            raise serializers.ValidationError("La ville est obligatoire.")
        return city.strip()

    def validate_favorite_sport(self, favorite_sport):
        """Valider que le sport favori n'est pas vide"""
        if not favorite_sport or not favorite_sport.strip():
            raise serializers.ValidationError("Le sport favori est obligatoire.")
        return favorite_sport.strip()

    def validate_level(self, level):
        """Valider que le niveau est correct"""
        valid_levels = ["beginner", "intermediate", "advanced"]
        if level not in valid_levels:
            raise serializers.ValidationError(
                "Le niveau doit être 'beginner', 'intermediate' ou 'advanced'."
            )
        return level

    def validate_position(self, position):
        """
        Valider la position (optionnelle mais, si fournie,
        ne doit pas être seulement des espaces)
        """
        if position is not None and position.strip() == "":
            raise serializers.ValidationError(
                "Si une position est fournie, elle ne peut pas être vide."
            )
        return position.strip() if position else None
