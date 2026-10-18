
from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Challenge, Submission
from .serializers import ChallengeSerializer


class ChallengeListCreateView(generics.ListCreateAPIView):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]


class ChallengeSubmissionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            challenge = Challenge.objects.get(pk=pk)
        except Challenge.DoesNotExist:
            raise serializers.ValidationError({
                "challenge": "Challenge not found."
            })

        answer = request.data.get("submitted_answer")
        algorithm = request.data.get("selected_algorithm", "")
        time_taken = request.data.get("time_taken_seconds")

        if answer is None or not str(answer).strip():
            raise serializers.ValidationError({
                "submitted_answer": "Please submit your answer."
            })

        try:
            time_taken = float(time_taken)
            if time_taken < 0:
                raise ValueError
        except (TypeError, ValueError):
            raise serializers.ValidationError({
                "time_taken_seconds": "Provide a valid time."
            })

        is_correct = (
            str(answer).strip() == challenge.expected_output.strip()
        )

        correctness_score = 70 if is_correct else 0
        efficiency_score = 0
        speed_score = 0
        total_score = min(
            correctness_score + efficiency_score + speed_score,
            challenge.points,
        )

        submission = Submission.objects.create(
            user=request.user,
            challenge=challenge,
            chosen_algorithm=str(algorithm)[:100],
            time_taken=int(time_taken),
            submitted_answer=str(answer),
            is_correct=is_correct,
            score=total_score,
        )

        feedback = (
            "Correct answer!" if is_correct
            else "Incorrect answer. Try again."
        )

        return Response({
            "submission_id": submission.id,
            "is_correct": is_correct,
            "correctness_score": correctness_score,
            "efficiency_score": efficiency_score,
            "speed_score": speed_score,
            "total_score": total_score,
            "feedback": feedback,
        })
