import json

from rest_framework import serializers

from .models import Challenge, Question, Score, Submission


class AllowedAlgorithmsField(serializers.ListField):
    DEFAULTS = {
        'sorting': ['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort'],
        'searching': ['linear-search', 'binary-search'],
        'graph': ['bfs', 'dfs'],
    }

    def to_representation(self, value):
        if value:
            return super().to_representation(value)
        instance = getattr(self.parent, 'instance', None)
        # When this field is rendered inside a ListSerializer, ``instance``
        # is the entire queryset/list rather than the row being serialized.
        # Fall back safely instead of treating that list as a Challenge.
        if isinstance(instance, (list, tuple)):
            return []
        if instance and instance.best_algorithm:
            return [instance.best_algorithm]
        topic = getattr(instance, 'topic', '') if instance else ''
        return self.DEFAULTS.get(str(topic).lower(), self.DEFAULTS['sorting'])


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'prompt', 'choices', 'order')


class ChallengeSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='topic', required=False)
    input_data = serializers.JSONField(required=False)
    target = serializers.JSONField(required=False, allow_null=True)
    allowed_algorithms = AllowedAlgorithmsField(
        child=serializers.CharField(max_length=100), required=False
    )
    expected_output = serializers.CharField(write_only=True, required=False, allow_blank=True)
    expected_answer = serializers.JSONField(write_only=True, required=False)
    questions = QuestionSerializer(many=True, read_only=True)
    time_limit_seconds = serializers.IntegerField(min_value=1, max_value=86400, required=False)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not instance.allowed_algorithms:
            representation['allowed_algorithms'] = (
                [instance.best_algorithm] if instance.best_algorithm else
                AllowedAlgorithmsField.DEFAULTS.get(
                    str(instance.topic).lower(), AllowedAlgorithmsField.DEFAULTS['sorting']
                )
            )
        return representation

    class Meta:
        model = Challenge
        fields = (
            'id', 'title', 'slug', 'description', 'difficulty', 'points',
            'input_data', 'expected_output', 'expected_answer', 'category',
            'target', 'time_limit_seconds', 'allowed_algorithms',
            'best_algorithm', 'optimal_operations', 'questions', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate(self, attrs):
        allowed = attrs.get('allowed_algorithms')
        if not allowed:
            topic = attrs.get('topic', self.instance.topic if self.instance else 'sorting')
            best = attrs.get('best_algorithm', self.instance.best_algorithm if self.instance else '')
            attrs['allowed_algorithms'] = [best] if best else self.fields['allowed_algorithms'].DEFAULTS.get(
                str(topic).lower(), self.fields['allowed_algorithms'].DEFAULTS['sorting']
            )
            allowed = attrs['allowed_algorithms']
        best_algorithm = attrs.get('best_algorithm', self.instance.best_algorithm if self.instance else '')
        if best_algorithm and best_algorithm not in allowed:
            raise serializers.ValidationError({
                'best_algorithm': 'The best algorithm must be included in the allowed choices.'
            })
        if allowed is not None and len(set(allowed)) != len(allowed):
            raise serializers.ValidationError({
                'allowed_algorithms': 'Algorithm choices must be unique.'
            })
        return attrs

    def create(self, validated_data):
        expected_output = validated_data.pop('expected_output', None)
        expected_answer = validated_data.pop('expected_answer', serializers.empty)
        if expected_answer is serializers.empty:
            expected_answer = self._derive_answer(validated_data)
        if expected_output is not None:
            validated_data['expected_output'] = expected_output
            if expected_answer in (serializers.empty, [], None):
                expected_answer = self._parse_answer(expected_output)
        validated_data['expected_answer'] = expected_answer
        return super().create(validated_data)

    def update(self, instance, validated_data):
        expected_output = validated_data.pop('expected_output', None)
        expected_answer = validated_data.pop('expected_answer', serializers.empty)
        if expected_answer is serializers.empty and expected_output is not None:
            expected_answer = self._parse_answer(expected_output)
        if expected_output is not None:
            validated_data['expected_output'] = expected_output
        if expected_answer is not serializers.empty:
            validated_data['expected_answer'] = expected_answer
        return super().update(instance, validated_data)

    @staticmethod
    def _parse_answer(answer):
        try:
            return json.loads(answer)
        except (TypeError, json.JSONDecodeError):
            return answer.strip()

    @staticmethod
    def _derive_answer(data):
        values = (data.get('input_data') or {}).get('values', [])
        topic = str(data.get('topic', '')).lower()
        if topic == 'sorting' and isinstance(values, list):
            try:
                return sorted(values)
            except TypeError:
                return []
        if topic == 'searching' and isinstance(values, list):
            target = data.get('target')
            try:
                return values.index(target)
            except ValueError:
                return -1
        return []


class SubmissionCreateSerializer(serializers.Serializer):
    selected_algorithm = serializers.CharField(max_length=100, required=False, allow_blank=True)
    submitted_answer = serializers.CharField(allow_blank=False, trim_whitespace=True)
    submitted_pseudocode = serializers.CharField(allow_blank=True, required=False, trim_whitespace=True)
    time_taken_seconds = serializers.FloatField(min_value=0, max_value=86400)
    operation_count = serializers.IntegerField(min_value=0, required=False, allow_null=True)


class SubmissionAdminSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)
    selected_algorithm = serializers.CharField(source='chosen_algorithm', read_only=True)
    total_score = serializers.IntegerField(source='score', read_only=True)
    created_at = serializers.DateTimeField(source='submitted_at', read_only=True)

    class Meta:
        model = Submission
        fields = (
            'id', 'username', 'challenge_title', 'selected_algorithm',
            'submitted_answer', 'is_correct', 'total_score', 'time_taken',
            'submitted_pseudocode', 'created_at',
        )


class ScoreSerializer(serializers.ModelSerializer):
    challenge_title = serializers.CharField(source='submission.challenge.title', read_only=True)

    class Meta:
        model = Score
        fields = (
            'id', 'challenge_title', 'total_score', 'correctness_score',
            'efficiency_score', 'speed_score', 'points_awarded', 'created_at',
        )
