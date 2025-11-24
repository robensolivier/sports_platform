from django.contrib import admin
from .models import Tournament, Team

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ['name', 'sport', 'city', 'start_date', 'get_organizer_username', 'get_organizer_email']
    list_filter = ['sport', 'city', 'start_date']
    search_fields = ['name', 'sport', 'organizer__full_name', 'organizer__email']

    def get_organizer_username(self, obj):
        return obj.organizer.full_name
    get_organizer_username.short_description = 'Organisateur'

    def get_organizer_email(self, obj):
        return obj.organizer.email
    get_organizer_email.short_description = 'Email organisateur'

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'sport', 'get_member_count']

    list_filter = ['sport']
    search_fields = ['name', 'sport']

    def get_member_count(self, obj):
        return obj.members.count()
    get_member_count.short_description = 'membres'