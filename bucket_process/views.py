from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
import urllib.parse

from bucket_list.models import Bucket
from account.models import HaehooUser
from .models import Process, Comment
from .forms import ProcessForm, CommentForm

def show_bucketprcs(request, bucketid):
    total_process = Process.objects.filter(bucket = bucketid)
    bucket = Bucket.objects.get(pk = bucketid)
    
    total_comment = Comment.objects.filter(bucket = bucketid)
    
    comment_form = CommentForm()
    
    return render(request, "prcs_popup.html",{'total_process' : total_process, 'bucket' : bucket, 'total_comment' : total_comment,"comment_form" : comment_form})

def create_bucketprcs(request, bucketid):
    if request.method == 'GET':
        form = ProcessForm()    
        return render(request, "prcs_create.html", {'process_form': form})
    
    elif request.method == 'POST' or request.method == 'FILES':
        form = ProcessForm(request.POST, request.FILES)
        if form.is_valid():
            prcs_instance = Process(bucket = Bucket.objects.get(pk = bucketid))
            form = ProcessForm(request.POST, request.FILES, instance= prcs_instance)
            form.save()
            return redirect('bucketprocess', bucketid = bucketid)

def edit_bucketprcs(request, processid):
    process = Process.objects.get(pk = processid)
    
    if request.method == 'GET':
        form = ProcessForm(instance=process)    
        return render(request, "prcs_edit.html", {'process_form': form})
    
    elif request.method == 'POST' or request.method == 'FILES':
        form = ProcessForm(request.POST, request.FILES)
        if form.is_valid():
            bucketid = process.bucket.id
            form = ProcessForm(request.POST, request.FILES, instance= process)
            form.save()
            return redirect('bucketprocess', bucketid = bucketid)
          
def delete_bucketprcs(request, processid):
    process = get_object_or_404(Process, pk = processid)
    bucketid = process.bucket.id
    process.delete()
    
    return redirect('bucketprocess', bucketid = bucketid)

def create_comment(request, bucketid, userid):
    form = CommentForm(request.POST)
    if form.is_valid():
        form = form.save(commit = False)
        form.bucket = get_object_or_404(Bucket, pk = bucketid)
        form.user = get_object_or_404(HaehooUser, pk = userid)
        form.save()
    return redirect('bucketprocess', bucketid = bucketid)
          
def delete_comment(request, bucketid, commentid):
    comment = get_object_or_404(Comment, pk = commentid)
    comment.delete()
    
    return redirect('bucketprocess', bucketid = bucketid)

def update_comment(request, commentid):
    comment = Comment.objects.get(pk = commentid)
    if request.method != "POST":
        return JsonResponse({"message":"Permission denied."})
    
    if request.method == 'POST':                
        newcomment = request.POST['comment']        
        comment.comment = newcomment
        comment.save()
        
        print("save success")
        return JsonResponse({"success":True, "newcomment":newcomment})
    else:
        print("save fail")
        return JsonResponse({"success":False})
        
