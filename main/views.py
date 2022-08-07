from django.shortcuts import render

def home(request):
    return render(request, "home.test.html")

def guide(request):
    return render(request, "guide.test.html")