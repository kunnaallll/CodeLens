import json
import re

from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Challenge, Question, Score, Submission
from .serializers import (
    ChallengeSerializer,
    ScoreSerializer,
    SubmissionAdminSerializer,
    SubmissionCreateSerializer,
)
from progress.services import award_eligible_achievements


def count_operations(challenge, algorithm):
    """Count deterministic primitive operations for the challenge's input."""
    data = challenge.input_data or {}
    values = data.get('values')
    if isinstance(values, list):
        array = list(values)
        comparisons = swaps = 0
        if algorithm == 'bubble-sort':
            for end in range(len(array) - 1, 0, -1):
                changed = False
                for index in range(end):
                    comparisons += 1
                    if array[index] > array[index + 1]:
                        array[index], array[index + 1] = array[index + 1], array[index]
                        swaps += 1
                        changed = True
                if not changed:
                    break
            return comparisons + swaps
        if algorithm == 'selection-sort':
            for start in range(len(array)):
                smallest = start
                for index in range(start + 1, len(array)):
                    comparisons += 1
                    if array[index] < array[smallest]:
                        smallest = index
                if smallest != start:
                    array[start], array[smallest] = array[smallest], array[start]
                    swaps += 1
            return comparisons + swaps
        if algorithm == 'insertion-sort':
            for index in range(1, len(array)):
                value = array[index]
                cursor = index - 1
                while cursor >= 0:
                    comparisons += 1
                    if array[cursor] <= value:
                        break
                    array[cursor + 1] = array[cursor]
                    swaps += 1
                    cursor -= 1
                array[cursor + 1] = value
            return comparisons + swaps
        if algorithm == 'merge-sort':
            counters = {'comparisons': 0, 'swaps': 0}

            def merge_sort(items):
                if len(items) < 2:
                    return items
                middle = len(items) // 2
                left = merge_sort(items[:middle])
                right = merge_sort(items[middle:])
                merged = []
                left_index = right_index = 0
                while left_index < len(left) and right_index < len(right):
                    counters['comparisons'] += 1
                    if left[left_index] <= right[right_index]:
                        merged.append(left[left_index])
                        left_index += 1
                    else:
                        merged.append(right[right_index])
                        right_index += 1
                        counters['swaps'] += 1
                return merged + left[left_index:] + right[right_index:]

            merge_sort(array)
            return counters['comparisons'] + counters['swaps']
        if algorithm == 'quick-sort':
            def quick_sort(low, high):
                count = 0
                if low >= high:
                    return count
                pivot = array[high]
                boundary = low - 1
                for index in range(low, high):
                    count += 1  # comparison
                    if array[index] <= pivot:
                        boundary += 1
                        array[boundary], array[index] = array[index], array[boundary]
                        count += 1  # swap, including a no-op swap
                array[boundary + 1], array[high] = array[high], array[boundary + 1]
                count += 1
                pivot_index = boundary + 1
                return count + quick_sort(low, pivot_index - 1) + quick_sort(pivot_index + 1, high)

            return quick_sort(0, len(array) - 1)
        if algorithm in ('linear-search', 'binary-search'):
            if algorithm == 'binary-search':
                array.sort()
                low, high = 0, len(array) - 1
                while low <= high:
                    middle = (low + high) // 2
                    comparisons += 1
                    if array[middle] == challenge.target:
                        break
                    if array[middle] < challenge.target:
                        low = middle + 1
                    else:
                        high = middle - 1
            else:
                for value in array:
                    comparisons += 1
                    if value == challenge.target:
                        break
            return comparisons
    graph = data.get('graph')
    if isinstance(graph, dict):
        start = next(iter(graph), None)
        if start is None:
            return 1
        visited = set()
        if algorithm == 'bfs':
            queue = [start]
            visited.add(start)
            operations = 1  # initial enqueue
            while queue:
                node = queue.pop(0)
                operations += 1  # visit
                for neighbor in sorted(graph.get(node, [])):
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
                        operations += 1  # enqueue
            return operations + 1  # done step
        if algorithm == 'dfs':
            def visit(node):
                visited.add(node)
                for neighbor in sorted(graph.get(node, [])):
                    if neighbor not in visited:
                        visit(neighbor)
            visit(start)
            return len(visited) + 1  # visits and done step
    return None


PSEUDOCODE_CRITERIA = {
    'bubble-sort': ('loop', 'compare', 'swap'),
    'selection-sort': ('loop', 'minimum', 'swap'),
    'insertion-sort': ('loop', 'key', 'shift'),
    'merge-sort': ('merge', 'left', 'right'),
    'quick-sort': ('pivot', 'partition', 'swap'),
    'linear-search': ('loop', 'compare', 'return'),
    'binary-search': ('while', 'middle', 'low', 'high'),
    'bfs': ('queue', 'visited', 'enqueue'),
    'dfs': ('visited', 'neighbor'),
}


def check_pseudocode(algorithm, pseudocode):
    """Check for the key steps that distinguish the chosen algorithm."""
    normalized = ' '.join(pseudocode.lower().replace('_', ' ').replace('-', ' ').split())
    criteria = PSEUDOCODE_CRITERIA.get(algorithm)
    if not normalized:
        return False, 'Add pseudocode for the selected algorithm.'
    if not criteria:
        return True, 'Pseudocode received.'
    missing = [term for term in criteria if term not in normalized]
    if missing:
        return False, f'Pseudocode is missing these key ideas: {", ".join(missing)}.'
    return True, 'Pseudocode includes the key steps for this algorithm.'


class ChallengeListCreateView(generics.ListCreateAPIView):
    queryset = Challenge.objects.prefetch_related('questions').all()
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method not in ('GET', 'HEAD', 'OPTIONS'):
            return [IsAdminUser()]
        return [IsAuthenticated()]


class ChallengeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Challenge.objects.prefetch_related('questions').all()
    serializer_class = ChallengeSerializer

    def get_object(self):
        identifier = self.kwargs['slug']
        query = Q(slug=identifier)
        if identifier.isdigit():
            query |= Q(pk=int(identifier))
        return get_object_or_404(self.get_queryset(), query)

    def get_permissions(self):
        if self.request.method not in ('GET', 'HEAD', 'OPTIONS'):
            return [IsAdminUser()]
        return [IsAuthenticated()]


class ChallengeSubmissionView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        challenge = get_object_or_404(Challenge, pk=pk)
        serializer = SubmissionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submitted = serializer.validated_data
        selected_algorithm = submitted.get('selected_algorithm') or challenge.best_algorithm

        allowed = challenge.allowed_algorithms or ([challenge.best_algorithm] if challenge.best_algorithm else [])
        if allowed and selected_algorithm not in allowed:
            raise ValidationError({
                'selected_algorithm': 'Choose one of the algorithms allowed for this challenge.'
            })

        expected = challenge.expected_answer
        if expected in (None, [], '') and challenge.expected_output:
            expected = self._parse_value(challenge.expected_output)
        actual = self._parse_value(submitted['submitted_answer'], expected)
        pseudocode_correct, pseudocode_feedback = check_pseudocode(
            selected_algorithm, submitted.get('submitted_pseudocode', '')
        )
        output_correct = actual == expected
        is_correct = output_correct and pseudocode_correct
        operation_count = count_operations(challenge, selected_algorithm)

        correctness_score = 70 if is_correct else 0
        efficient = not challenge.best_algorithm or selected_algorithm == challenge.best_algorithm
        if challenge.optimal_operations and operation_count is not None:
            efficiency_score = min(20, round(20 * challenge.optimal_operations / max(1, operation_count))) if is_correct else 0
        else:
            efficiency_score = 20 if is_correct and efficient else 0
        speed_score = 10 if is_correct and submitted['time_taken_seconds'] <= challenge.time_limit_seconds else 0
        total_score = correctness_score + efficiency_score + speed_score
        points_awarded = round(challenge.points * total_score / 100)

        submission = Submission.objects.create(
            user=request.user,
            challenge=challenge,
            chosen_algorithm=selected_algorithm[:100],
            time_taken=max(0, int(submitted['time_taken_seconds'])),
            operation_count=operation_count,
            submitted_answer=submitted['submitted_answer'],
            is_correct=is_correct,
            score=total_score,
        )
        score = Score.objects.create(
            user=request.user,
            submission=submission,
            total_score=total_score,
            correctness_score=correctness_score,
            efficiency_score=efficiency_score,
            speed_score=speed_score,
            points_awarded=points_awarded,
        )
        award_eligible_achievements(request.user)

        if is_correct:
            feedback = 'Correct output and pseudocode!'
        elif not output_correct:
            feedback = 'The final output does not match the expected result. ' + pseudocode_feedback
        else:
            feedback = pseudocode_feedback
        return Response({
            'submission_id': submission.id,
            'is_correct': is_correct,
            'output_correct': output_correct,
            'pseudocode_correct': pseudocode_correct,
            'pseudocode_feedback': pseudocode_feedback,
            'correctness_score': score.correctness_score,
            'efficiency_score': score.efficiency_score,
            'speed_score': score.speed_score,
            'total_score': score.total_score,
            'points_awarded': score.points_awarded,
            'operation_count': operation_count,
            'optimal_operations': challenge.optimal_operations,
            'feedback': feedback,
        })

    @staticmethod
    def _parse_value(value, expected=None):
        if not isinstance(value, str):
            return value
        normalized = value.strip()
        try:
            return json.loads(normalized)
        except json.JSONDecodeError:
            if isinstance(expected, list) and ',' in normalized:
                parts = [part.strip().strip('[]').strip().strip('"\'') for part in normalized.split(',')]
                if expected and all(isinstance(item, (int, float)) and not isinstance(item, bool) for item in expected):
                    if all(re.fullmatch(r'-?\d+(?:\.\d+)?', part) for part in parts):
                        return [float(part) if '.' in part else int(part) for part in parts]
                return parts
            return normalized


class QuestionAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        question = get_object_or_404(Question, pk=pk)
        answer = request.data.get('answer')
        if not isinstance(answer, str) or not answer.strip():
            raise ValidationError({'answer': 'Choose an answer before checking it.'})
        is_correct = answer.strip().casefold() == question.correct_answer.strip().casefold()
        return Response({
            'is_correct': is_correct,
            'feedback': 'Correct!' if is_correct else 'Not quite. Try another choice.',
            'explanation': question.explanation if is_correct else '',
        })


class AdminSubmissionListView(generics.ListAPIView):
    queryset = Submission.objects.select_related('user', 'challenge').all()
    serializer_class = SubmissionAdminSerializer
    permission_classes = [IsAdminUser]


class MyScoresListView(generics.ListAPIView):
    serializer_class = ScoreSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Score.objects.filter(user=self.request.user).select_related('submission__challenge')
