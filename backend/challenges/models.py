
from django.db import models
from django.conf import settings


class Challenge(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=50)
    points = models.IntegerField(default=10)
    input_data = models.TextField(blank=True, default="")
    expected_output = models.TextField(blank=True, default="")

    def __str__(self):
        return self.title


class Submission(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    chosen_algorithm = models.CharField(max_length=100)
    time_taken = models.PositiveIntegerField()
    submitted_answer = models.TextField(blank=True, default="")
    is_correct = models.BooleanField(default=False)
    score = models.IntegerField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} - {self.challenge}'