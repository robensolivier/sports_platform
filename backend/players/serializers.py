from rest_framework import serializers
from .models import PlayerProfile

class PlayerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)
    clerk_id = serializers.CharField(source="user.clerk_id", read_only=True)

    class Meta:
        model = PlayerProfile
        fields = [
            "id",
            "user",
            "email",
            "full_name",
            "role",
            "clerk_id",
            "city",
            "favorite_sport",
            "level",
            "position",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "email",
            "full_name",
            "role",
            "clerk_id",
            "created_at",
            "updated_at",
        ]

    def validate_city(self, city):
        """Valider que la ville n'est pas vide si fournie"""
        if city is not None and not city.strip():
            raise serializers.ValidationError("La ville ne peut pas être vide.")
        return city.strip() if city else city

    def validate_favorite_sport(self, favorite_sport):
        """Valider que le sport favori n'est pas vide si fourni"""
        if favorite_sport is not None and not favorite_sport.strip():
            raise serializers.ValidationError("Le sport favori ne peut pas être vide.")
        return favorite_sport.strip() if favorite_sport else favorite_sport

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
        return position.strip() if position else position