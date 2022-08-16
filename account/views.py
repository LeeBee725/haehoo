from django.shortcuts import render, redirect
from django.contrib import auth

def signup(request):
  return render(request, 'signup.html')

def login(request):
  if request.method == 'POST':
    username = request.POST['id']
    password = request.POST['password']
    user = auth.authenticate(request, username=username, password=password)
    if user is not None:
      auth.login(request, user)
      return redirect('home')
    else:
      return render(request, 'login.html')
  else:
    return render(request, 'login.html')
    
    
def logout(request):
  auth.logout(request)
  return redirect('home')