from django.db import models
from account.models import HaehooUser

# Create your models here.

class Bucket(models.Model):
    user = models.ForeignKey(HaehooUser, on_delete = models.CASCADE, related_name="user-make-bucket+")
    title = models.CharField(max_length = 100)
    category = models.IntegerField()
    createdAt = models.DateTimeField(auto_now = True)
    liked_users = models.ManyToManyField(HaehooUser, blank = True, related_name="user-like-bucket+")
    referenced_users = models.ManyToManyField(HaehooUser, blank = True, related_name="user-reference-bucket+")
    top_fixed = models.BooleanField(default=False)