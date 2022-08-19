from django.db import models
from account.models import HaehooUser

# Create your models here.

class Bucket(models.Model):
    userID = models.ForeignKey(HaehooUser, on_delete = models.CASCADE)
    title = models.CharField(max_length = 100)
    category = models.IntegerField()
    createdAt = models.DateTimeField(auto_now = False)
