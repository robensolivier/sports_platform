from django.contrib import admin
from .models import PlayerProfile

@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = ['get_username', 'get_email', 'city', 'favorite_sport', 'level', 'position']
    list_filter = ['city', 'favorite_sport', 'level']
    search_fields = ['user__full_name', 'user__email', 'city', 'favorite_sport']

    def get_username(self, obj):
        return obj.user.full_name
    get_username.short_description = 'Nom complet'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'