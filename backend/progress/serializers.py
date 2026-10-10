from rest_framework import serializers
from .models import Progress

class ProgressSerializer(serializers.ModelSerializer):
    algorithm_name = serializers.CharField(source='algorithm.name', read_only=True)

    class Meta:
        model = Progress
        fields = ('id', 'user', 'algorithm', 'algorithm_name', 'completed', 'score')
        read_only_fields = ('user',)
