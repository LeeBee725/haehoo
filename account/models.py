from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class HaehooUser(AbstractUser):
    #ID : AbstractUSer의 내장 property(username)
    #비밀번호 : AbstractUSer의 내장 property(password)
    nickname = models.CharField(max_length = 10, unique = True, null = False)