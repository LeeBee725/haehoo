from django.shortcuts import render, redirect, get_object_or_404
from account.models import HaehooUser
from bucket_list.models import Bucket

def total(request):
    total_bucket = Bucket.objects
    return render(request, "total.html", {'total_bucket' : total_bucket})

def private(request, nickname):
    user = HaehooUser.objects.filter(nickname = nickname)
    buckets = Bucket.objects.filter(userID = user.get())
    return render(request, "private.html", {"nickname" : nickname, "buckets" : buckets})

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
        return render(request, "create.html", {"nickname" : nickname})

def delete(request, nickname, bucket_id):
    bucket = get_object_or_404(Bucket, pk = bucket_id)
    bucket.delete()

    return redirect('private', nickname=nickname)
