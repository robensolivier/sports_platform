from django.contrib import admin
from .models import Tournament, Team

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ['name', 'sport', 'city', 'start_date', 'organizer__username', 'organizer__email']
    list_filter = ['sport', 'city', 'start_date']
    search_fields = ['name', 'sport', 'organizer__username', 'organizer__email']

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'tournament__name', 'current_capacity', 'max_capacity']
    list_filter = ['tournament']
    search_fields = ['name', 'tournament__name']
