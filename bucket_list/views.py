from django.shortcuts import render, redirect

from .models import Bucket
# from .models import CommentBucket
# from .models import Process

def total(request):
    total_bucket = Bucket.objects
    return render(request, 'total.test.html', {'total_bucket' : total_bucket})
    # return render(request, "total.html")

def private(request, nickname):
    return render(request, "private.test.html", {"nickname" : nickname})

def create(request, nickname):
    if request.method == "POST":
        return redirect('private', nickname=nickname)
    else:
        return render(request, "create.test.html", {"nickname" : nickname})