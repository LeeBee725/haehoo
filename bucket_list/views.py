from django.shortcuts import render, redirect

from account.models import HaehooUser
from bucket_list.models import Bucket

def total(request):
    return render(request, "total.html")

def private(request, nickname):
    return render(request, "private.test.html", {"nickname" : nickname})

def create(request, nickname):
    if request.method == "POST":
        user = HaehooUser.objects.filter(nickname=nickname)
        title = request.POST["title"]
        category = int(request.POST["category"])
        newBucket = Bucket(
            title = title,
            category = category
        )
        newBucket.userID = user.get()
        newBucket.save()
        return redirect('private', nickname=nickname)
    else:
        return render(request, "create.test.html", {"nickname" : nickname})