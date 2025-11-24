from django.contrib import admin
from .models import JoinRequest

@admin.register(JoinRequest)
class JoinRequestAdmin(admin.ModelAdmin):
    list_display = ['get_player_username', 'get_player_email', 'get_team_name', 'status', 'message', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['player__full_name', 'player__email', 'team__name']

    def get_player_username(self, obj):
        return obj.player.full_name
    get_player_username.short_description = 'Joueur'

    def get_player_email(self, obj):
        return obj.player.email
    get_player_email.short_description = 'Email joueur'

    def get_team_name(self, obj):
        return obj.team.name
    get_team_name.short_description = 'Équipe'
