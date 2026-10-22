from django.conf import settings
from django.db import models
from django.utils import timezone

from algorithms.models import Algorithm


class Progress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='algorithm_progress', on_delete=models.CASCADE)
    algorithm = models.ForeignKey(Algorithm, related_name='progress_records', on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ('-updated_at',)
        constraints = [
            models.UniqueConstraint(fields=('user', 'algorithm'), name='unique_user_algorithm_progress'),
        ]

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.algorithm.name}"


class Achievement(models.Model):
    code = models.SlugField(max_length=60, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=40, default='star')
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='achievement_records', on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, related_name='unlocks', on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-unlocked_at',)
        constraints = [
            models.UniqueConstraint(fields=('user', 'achievement'), name='unique_user_achievement'),
        ]

    def __str__(self):
        return f'{self.user} — {self.achievement}'
