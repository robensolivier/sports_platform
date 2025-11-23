from django.contrib import admin
from .models import OrganizerProfile


@admin.register(OrganizerProfile)
class OrganizerProfileAdmin(admin.ModelAdmin):
    list_display = ["get_full_name", "get_email", "organization_name", "city", "phone"]
    list_filter = ["city"]
    search_fields = ["user__full_name", "user__email", "organization_name", "city"]

    def get_full_name(self, obj):
        return obj.user.full_name
    get_full_name.short_description = "Nom complet"

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = "Email"
