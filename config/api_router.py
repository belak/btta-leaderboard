from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from leaderboard.images.api.views import ImageViewSet
from leaderboard.scores.api.views import ScoreViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("images", ImageViewSet)
router.register("scores", ScoreViewSet)

app_name = "api"
urlpatterns = router.urls
