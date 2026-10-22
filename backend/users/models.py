from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.CharField(max_length=280, blank=True)

    def __str__(self):
        return self.username
