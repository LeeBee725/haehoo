from django.shortcuts import render

def total(request):
    return render(request, "total.test.html")

def private(request, nickname):
    return render(request, "private.test.html", {"nickname" : nickname})