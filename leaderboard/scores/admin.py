from django.contrib import admin

from .models import Score


@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ["game_name", "player_name", "player_score"]
    list_filter = ("player_name",)
