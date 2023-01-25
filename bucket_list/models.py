from django.db import models
from account.models import HaehooUser

class Bucket(models.Model):
    user = models.ForeignKey(HaehooUser, on_delete = models.CASCADE, related_name="user-make-bucket+")
    title = models.CharField(max_length = 100)
    category = models.IntegerField()
    createdAt = models.DateTimeField(auto_now = True)
    liked_users = models.ManyToManyField(HaehooUser, blank = True, related_name="user-like-bucket+")
    derived_bucket = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, related_name="deriving_bucket")

    def __str__(self):
        return f"{self.user}'s {self.title}"
