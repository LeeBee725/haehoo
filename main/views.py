from django.shortcuts import render

def main(request):
    return render(request, "main.html")

def guide(request):
    return render(request, "guide.test.html")