from django.contrib import admin
from .models import Match

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['team_a__name', 'team_b__name', 'date', 'location', 'score_a', 'score_b', 'created_at']
    list_filter = ['date', 'location']
    search_fields = ['location', 'team_a__name', 'team_b__name']
