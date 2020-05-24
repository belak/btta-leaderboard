from django.contrib.auth.models import AbstractUser
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _

from leaderboard.util import models

class User(AbstractUser):
    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = models.CharField(_("Name of User"), blank=True, max_length=255)
