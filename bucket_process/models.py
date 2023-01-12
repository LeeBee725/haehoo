from django.db import models
from bucket_list.models import Bucket
from account.models import HaehooUser


# Create your models here.
class Process(models.Model):
    bucketID = models.ForeignKey(Bucket, on_delete= models.CASCADE, related_name = 'bucket-has-process+')
    title = models.CharField(max_length= 100)
    text = models.TextField()
    createdAt = models.DateTimeField(auto_now = True)
    image = models.ImageField(blank = True, upload_to='bucket_process')
    
class Comment(models.Model):
    comment = models.CharField(max_length=200)
    createdAt = models.DateTimeField(auto_now = True)
    bucketID = models.ForeignKey(Bucket, on_delete= models.CASCADE, related_name = 'bucket-has-comment+')
    userID = models.ForeignKey(HaehooUser, on_delete = models.CASCADE, related_name="user-write-comment+")

