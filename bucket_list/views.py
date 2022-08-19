from django.shortcuts import render

def total(request):
    return render(request, "total.html")

def private(request, nickname):
    return render(request, "private.test.html", {"nickname" : nickname})

def create(request, nickname):
    return render(request, "create.test.html", {"nickname" : nickname})