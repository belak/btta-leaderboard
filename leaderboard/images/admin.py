from django.contrib import admin, messages
from django.utils.translation import ngettext
from sorl.thumbnail.admin import AdminImageMixin

from .models import Image


@admin.register(Image)
class ImageAdmin(AdminImageMixin, admin.ModelAdmin):
    list_display = ["name", "enabled"]
    list_filter = ("enabled",)
    actions = ['make_enabled', 'make_disabled']

    def make_enabled(self, request, queryset):
        updated = queryset.update(enabled=True)
        self.message_user(request, ngettext(
            '%d image was successfully marked as enabled.',
            '%d images were successfully marked as enabled.',
            updated,
        ) % updated, messages.SUCCESS)
    make_enabled.short_description = "Enable images"

    def make_disabled(self, request, queryset):
        updated = queryset.update(enabled=False)
        self.message_user(request, ngettext(
            '%d image was successfully marked as disabled.',
            '%d images were successfully marked as disabled.',
            updated,
        ) % updated, messages.SUCCESS)
    make_disabled.short_description = "Disable images"
