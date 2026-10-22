
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.text import slugify


class Challenge(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    difficulty = models.CharField(max_length=50)
    points = models.PositiveIntegerField(default=100)
    input_data = models.JSONField(blank=True, default=dict)
    target = models.JSONField(null=True, blank=True, default=None)
    expected_output = models.TextField(blank=True, default="")
    topic = models.CharField(max_length=100, default='sorting')
    expected_answer = models.JSONField(default=list)
    best_algorithm = models.CharField(max_length=100, blank=True)
    optimal_operations = models.PositiveIntegerField(null=True, blank=True)
    time_limit_seconds = models.PositiveIntegerField(default=60)
    allowed_algorithms = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ('id',)

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        if not self.slug:
            base = slugify(self.title) or 'challenge'
            self.slug = base
            suffix = 2
            while Challenge.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f'{base}-{suffix}'
                suffix += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Submission(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    chosen_algorithm = models.CharField(max_length=100)
    time_taken = models.PositiveIntegerField()
    submitted_answer = models.TextField(blank=True, default="")
    submitted_pseudocode = models.TextField(blank=True, default="")
    is_correct = models.BooleanField(default=False)
    score = models.IntegerField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True)
    operation_count = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ('-submitted_at',)

    def __str__(self):
        return f'{self.user} - {self.challenge}'


class Question(models.Model):
    challenge = models.ForeignKey(Challenge, related_name='questions', on_delete=models.CASCADE)
    prompt = models.TextField()
    choices = models.JSONField(default=list, blank=True)
    correct_answer = models.CharField(max_length=500)
    explanation = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ('order', 'id')

    def __str__(self):
        return f'{self.challenge.title}: {self.prompt[:60]}'


class Score(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='scores', on_delete=models.CASCADE)
    submission = models.OneToOneField(Submission, related_name='score_breakdown', on_delete=models.CASCADE)
    total_score = models.PositiveSmallIntegerField(default=0)
    correctness_score = models.PositiveSmallIntegerField(default=0)
    efficiency_score = models.PositiveSmallIntegerField(default=0)
    speed_score = models.PositiveSmallIntegerField(default=0)
    points_awarded = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f'{self.user} — {self.total_score}/100'
