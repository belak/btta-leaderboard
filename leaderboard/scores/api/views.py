from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .serializers import ScoreSerializer

from ..models import Score


class ScoreViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    # This is a view-only API so no permissions are needed for access.
    permission_classes = []

    serializer_class = ScoreSerializer
    queryset = Score.objects.all()
