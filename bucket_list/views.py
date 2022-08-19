from django.shortcuts import render

from .models import Bucket
from .models import CommentBucket
from .models import Process

def total(request):
    return render(request, "total.html")

def private(request, nickname):
    return render(request, "private.test.html", {"nickname" : nickname})

def create(request, nickname):
    return render(request, "create.test.html", {"nickname" : nickname})


# models 담당

def home(request):
    home = home.objects
    return render(request, 'total.test.html', {'home' : home})