from django.contrib import admin
from .models import Match

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['get_team_a_name', 'get_team_b_name', 'date', 'location', 'score_a', 'score_b', 'created_at']
    list_filter = ['date', 'location']
    search_fields = ['location', 'team_a__name', 'team_b__name']

    def get_team_a_name(self, obj):
        return obj.team_a.name
    get_team_a_name.short_description = 'Équipe A'

    def get_team_b_name(self, obj):
        return obj.team_b.name
    get_team_b_name.short_description = 'Équipe B'
