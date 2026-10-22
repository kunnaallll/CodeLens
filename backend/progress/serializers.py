from rest_framework import serializers
from .models import Progress
from .models import Achievement

class ProgressSerializer(serializers.ModelSerializer):
    algorithm_name = serializers.CharField(source='algorithm.name', read_only=True)
    algorithm_slug = serializers.CharField(source='algorithm.slug', read_only=True)

    class Meta:
        model = Progress
        fields = (
            'id', 'user', 'algorithm', 'algorithm_name', 'algorithm_slug',
            'completed', 'score', 'completed_at', 'created_at', 'updated_at',
        )
        read_only_fields = ('user', 'completed', 'score', 'completed_at', 'created_at', 'updated_at')


class AchievementSerializer(serializers.ModelSerializer):
    unlocked = serializers.SerializerMethodField()
    unlocked_at = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = ('id', 'code', 'name', 'description', 'icon', 'is_active', 'unlocked', 'unlocked_at')
        read_only_fields = ('unlocked', 'unlocked_at')

    def get_unlocked(self, obj):
        return obj.id in self.context.get('unlocked_ids', set())

    def get_unlocked_at(self, obj):
        record = self.context.get('unlocked_records', {}).get(obj.id)
        return record.unlocked_at if record else None
