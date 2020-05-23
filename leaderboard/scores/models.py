from django.db import models

class Score(models.Model):
    game_slug = models.CharField(max_length=64, primary_key=True)
    game_banner = models.ImageField()
    game_name = models.CharField(max_length=255)
    player_name = models.CharField(max_length=255)
    player_score = models.BigIntegerField()

    class Meta:
        ordering = ['game_name']

    def __str__(self):
        return self.game_name
