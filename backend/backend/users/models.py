from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_ADMIN = 1
    ROLE_USER = 2
    ROLE_AGENT = 3

    ROLE_CHOICES = (
        (ROLE_ADMIN, "admin"),
        (ROLE_USER, "user"),
        (ROLE_AGENT, "agent"),
    )

    role = models.PositiveSmallIntegerField(
        choices=ROLE_CHOICES,
        default=ROLE_USER,
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
