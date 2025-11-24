from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'clerk_id', 'email', 'full_name', 'role', 'created_at', 'is_registered']
        read_only_fields = ['id', 'clerk_id', 'created_at', 'is_registered']


    # Validation des champs
    def validate_email(self, email):
        """Valider que l'email n'est pas vide"""
        if not email or not email.strip():
            raise serializers.ValidationError("L'email est obligatoire.")
        return email.strip()
        
    def validate_full_name(self, full_name):
        """Valider que le nom complet n'est pas vide"""
        if not full_name or not full_name.strip():
            raise serializers.ValidationError("Le nom complet est obligatoire.")
        return full_name.strip()
        
    def validate_role(self, role):
        """Valider que le rôle est correct"""
        valid_roles = ['player', 'organizer']
        if role not in valid_roles:
            raise serializers.ValidationError("Le rôle doit être 'player' ou 'organizer'.")
        return role
