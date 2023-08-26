from django.shortcuts import render, redirect
from customer_support.models import FeedBack
import time

def feedback(request):
    if request.method == "POST":
        newFeedback = FeedBack(
            content=request.POST["content"]
        )
        newFeedback.save()
        time.sleep(1)
        return redirect('main')
    else:
        return render(request, 'feedback.html')
