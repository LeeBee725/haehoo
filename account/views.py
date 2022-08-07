from django.shortcuts import render

def signup(request):
    return render(request, 'signup.test.html')

def login(request):
    return render(request, 'login.test.html')
