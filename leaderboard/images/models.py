from django.db import models


class Image(models.Model):
    name = models.CharField(max_length=255, unique=True)
    image = models.ImageField()

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
