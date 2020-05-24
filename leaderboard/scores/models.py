from leaderboard.util import models


class Score(models.TimeStampedModel, models.Model):
    game_banner = models.ImageField()
    game_name = models.CharField(max_length=255)
    player_name = models.CharField(max_length=255)
    player_score = models.BigIntegerField()

    class Meta:
        ordering = ["game_name"]

    def __str__(self):
        return self.game_name
