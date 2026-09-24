from django.db import models


class Challenge(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=50)
    points = models.IntegerField(default=10)

    def __str__(self):
        return self.title