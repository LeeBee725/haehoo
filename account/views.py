from django.shortcuts import render, redirect
from django.contrib import auth
from .models import HaehooUser


def signup(request):
  if request.method == 'POST':
    username = request.POST['id']
    password = request.POST['password']
    nickname = request.POST['nickname']

    if HaehooUser.objects.filter(username = username).exists():
      return render(request, 'signup.html', {'error' : "이미 존재하는 아이디입니다."})

    if HaehooUser.objects.filter(nickname = nickname).exists():
      return render(request, 'signup.html', {'error' : "이미 존재하는 닉네임입니다."})

    if request.POST['password'] == request.POST['passwordCheck']:
        user = HaehooUser.objects.create_user(
          username=request.POST['id'],
          password=request.POST['password'],
          nickname=request.POST['nickname'],)
        auth.login(request, user)
        return redirect('/')
    return render(request, 'signup.html', {'error' : "비밀번호 확인이 일치하지 않습니다."})
  return render(request, 'signup.html')

def login(request):
  if request.method == 'POST':
    username = request.POST['id']
    password = request.POST['password']
    user = auth.authenticate(request, username=username, password=password)
    if user is not None:
      auth.login(request, user)
      return redirect('main')
    else:
      return render(request, 'login.html', {'error' : "올바르지 않은 정보입니다."})
  else:
    return render(request, 'login.html')
    
    
def logout(request):
  auth.logout(request)
  return redirect('main')