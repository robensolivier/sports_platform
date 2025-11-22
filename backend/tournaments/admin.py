from django.contrib import admin
from .models import Tournament, Team

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ['name', 'sport', 'city', 'start_date', 'get_organizer_username', 'get_organizer_email']
    list_filter = ['sport', 'city', 'start_date']
    search_fields = ['name', 'sport', 'organizer__username', 'organizer__email']

    def get_organizer_username(self, obj):
        return obj.organizer.username
    get_organizer_username.short_description = 'Organisateur'

    def get_organizer_email(self, obj):
        return obj.organizer.email
    get_organizer_email.short_description = 'Email organisateur'

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'get_tournament_name', 'current_capacity', 'max_capacity']
    list_filter = ['tournament']
    search_fields = ['name', 'tournament__name']

    def get_tournament_name(self, obj):
        return obj.tournament.name
    get_tournament_name.short_description = 'Tournoi'
