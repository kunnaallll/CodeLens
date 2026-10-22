from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class Algorithm(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField()
    category = models.CharField(max_length=100)
    time_complexity = models.CharField(max_length=50)
    space_complexity = models.CharField(max_length=50)
    best_case = models.CharField(max_length=50, blank=True)
    average_case = models.CharField(max_length=50, blank=True)
    worst_case = models.CharField(max_length=50, blank=True)
    difficulty = models.CharField(max_length=20, default='easy')
    explanation = models.TextField(blank=True)
    pseudocode = models.TextField(blank=True)
    example = models.TextField(blank=True)
    visualization_steps = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ('name',)

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        if not self.slug:
            base = slugify(self.name) or 'algorithm'
            self.slug = base
            suffix = 2
            while Algorithm.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f'{base}-{suffix}'
                suffix += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class DataStructure(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField()
    operations = models.JSONField(default=list, blank=True)
    time_complexity = models.JSONField(default=dict, blank=True)
    space_complexity = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ('name',)

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        if not self.slug:
            base = slugify(self.name) or 'data-structure'
            self.slug = base
            suffix = 2
            while DataStructure.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f'{base}-{suffix}'
                suffix += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
