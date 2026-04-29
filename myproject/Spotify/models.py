from django.db import models

from django.utils import timezone  # ADD THIS IMPORT

class SignupUser(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    name = models.CharField(max_length=100)
    dob = models.DateField()
    gender = models.CharField(max_length=20)
    marketing_opt_out = models.BooleanField(default=False)
    marketing_share = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=timezone.now)  # 👈 change here

    def __str__(self):
        return self.email

