from rest_framework import serializers
from sorl.thumbnail import get_thumbnail

from ..models import Score


class ScoreSerializer(serializers.ModelSerializer):
    game_banner_thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Score
        fields = '__all__'

    def get_game_banner_thumbnail(self, obj):
        return get_thumbnail(obj.game_banner, "300").url
