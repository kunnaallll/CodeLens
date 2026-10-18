
from rest_framework import serializers
from .models import Challenge


class ChallengeSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    target = serializers.SerializerMethodField()
    time_limit_seconds = serializers.SerializerMethodField()
    allowed_algorithms = serializers.SerializerMethodField()

    class Meta:
        model = Challenge
        fields = [
            'id',
            'title',
            'description',
            'difficulty',
            'points',
            'input_data',
            'expected_output',
            'category',
            'target',
            'time_limit_seconds',
            'allowed_algorithms',
        ]

    def get_category(self, obj):
        return 'general'

    def get_target(self, obj):
        return None

    def get_time_limit_seconds(self, obj):
        return 60

    def get_allowed_algorithms(self, obj):
        return ['addition']
