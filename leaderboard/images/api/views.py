from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet

from .serializers import ImageSerializer

from ..models import Image


class ImageViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    # This is a view-only API so no permissions are needed for access.
    permission_classes = []

    serializer_class = ImageSerializer
    queryset = Image.objects.all()
