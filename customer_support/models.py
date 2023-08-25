from django.db import models

class FeedBack(models.Model):
    content = models.TextField()