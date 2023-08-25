from django.shortcuts import render

def main(request):
    return render(request, "main.html")

def guide(request):
    return render(request, "guide.html")

def prepare(request):
    return render(request, 'prepare.html')