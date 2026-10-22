from rest_framework import serializers
from .models import Algorithm, DataStructure


class AlgorithmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Algorithm
        fields = '__all__'


class DataStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataStructure
        fields = '__all__'
