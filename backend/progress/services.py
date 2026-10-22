from challenges.models import Score, Submission
from django.utils import timezone
from datetime import timedelta
from .models import Achievement, Progress, UserAchievement


def award_eligible_achievements(user):
    completed = Progress.objects.filter(user=user, completed=True).count()
    attempts = Submission.objects.filter(user=user)
    correct = attempts.filter(is_correct=True).count()
    activity_days = set(attempts.dates('submitted_at', 'day', order='DESC'))
    activity_days.update(
        Progress.objects.filter(user=user, completed_at__isnull=False)
        .dates('completed_at', 'day', order='DESC')
    )
    day = timezone.localdate()
    if day not in activity_days:
        day -= timedelta(days=1)
    streak = 0
    while day in activity_days:
        streak += 1
        day -= timedelta(days=1)
    checks = {
        'first-steps': completed >= 1 or correct >= 1,
        'challenge-winner': correct >= 1,
        'perfect-score': Score.objects.filter(user=user, total_score=100).exists(),
        'five-challenges': attempts.count() >= 5,
        'seven-day-streak': streak >= 7,
    }
    earned = Achievement.objects.filter(
        code__in=[code for code, eligible in checks.items() if eligible],
        is_active=True,
    )
    for achievement in earned:
        UserAchievement.objects.get_or_create(user=user, achievement=achievement)
