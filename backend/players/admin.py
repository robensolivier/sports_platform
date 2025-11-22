from django.contrib import admin
from .models import PlayerProfile

@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = ['user__username', 'user__email', 'city', 'favorite_sport', 'level', 'position']
    list_filter = ['city', 'favorite_sport', 'level']
    search_fields = ['user__username', 'user__email', 'city', 'favorite_sport']