from django.shortcuts import render, redirect

def total(request):
    return render(request, "total.html")

def private(request, nickname):
    return render(request, "private.test.html", {"nickname" : nickname})

def create(request, nickname):
    if request.method == "POST":
        return redirect('private', nickname=nickname)
    else:
        return render(request, "create.test.html", {"nickname" : nickname})