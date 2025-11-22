from django.contrib import admin
from .models import JoinRequest

@admin.register(JoinRequest)
class JoinRequestAdmin(admin.ModelAdmin):
    list_display = ['player__username', 'player__email', 'team__name', 'status', 'message', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['player__username', 'player__email', 'team__name']
