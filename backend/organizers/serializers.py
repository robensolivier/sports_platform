from rest_framework import serializers
from .models import OrganizerProfile


class OrganizerProfileSerializer(serializers.ModelSerializer):
    # champs dérivés du User
    email = serializers.EmailField(source="user.email", read_only=True)
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)

    class Meta:
        model = OrganizerProfile
        fields = [
            "id",
            "user",
            "email",
            "full_name",
            "role",
            "organization_name",
            "city",
            "phone",
            "bio",
        ]
        read_only_fields = ["id", "user", "email", "full_name", "role"]
