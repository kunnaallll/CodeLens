from django.db import models


class Algorithm(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=100)
    time_complexity = models.CharField(max_length=50)
    space_complexity = models.CharField(max_length=50)

    def __str__(self):
        return self.name