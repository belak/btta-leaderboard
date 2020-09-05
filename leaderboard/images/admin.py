from django.contrib import admin
from sorl.thumbnail.admin import AdminImageMixin

from .models import Image


@admin.register(Image)
class ImageAdmin(AdminImageMixin, admin.ModelAdmin):
    list_display = ["name"]
