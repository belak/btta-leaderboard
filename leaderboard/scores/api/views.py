from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet

from .serializers import ScoreSerializer

from ..models import Score


class ScoreViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    # This is a view-only API so no permissions are needed for access.
    permission_classes = []

    serializer_class = ScoreSerializer
    queryset = Score.objects.all()
