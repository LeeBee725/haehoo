from django.shortcuts import render, redirect, get_object_or_404
from account.models import HaehooUser
from .models import Bucket

def total(request):
    return render(request, "total.html")

def private(request, nickname):
    user = HaehooUser.objects.filter(nickname = nickname)
    buckets = Bucket.objects.filter(userID = user.get())
    return render(request, "private.test.html", {"nickname" : nickname, "buckets" : buckets})

def create(request, nickname):
    if request.method == "POST":
        return redirect('private', nickname=nickname)
    else:
        return render(request, "create.test.html", {"nickname" : nickname})