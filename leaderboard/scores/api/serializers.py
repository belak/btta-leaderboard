from rest_framework import serializers

from ..models import Score


class ScoreSerializer(serializers.ModelSerializer):
    game_banner_thumbnail = serializers.CharField()

    class Meta:
        model = Score
        fields = '__all__'
