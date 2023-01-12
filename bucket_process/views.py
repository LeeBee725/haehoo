from django.shortcuts import render, redirect, get_object_or_404
from bucket_list.models import Bucket
from account.models import HaehooUser
from .models import Process, Comment
from .forms import ProcessForm, CommentForm

def show_bucketprcs(request, bucketid):
    total_process = Process.objects.filter(bucketID = bucketid)
    bucket = Bucket.objects.get(pk = bucketid)
    
    total_comment = Comment.objects.filter(bucketID = bucketid)
    
    comment_form = CommentForm()
    
    return render(request, "prcs_popup.html",{'total_process' : total_process, 'bucket' : bucket, 'total_comment' : total_comment,"comment_form" : comment_form})

def create_bucketprcs(request, bucketid):
    if request.method == 'GET':
        form = ProcessForm()    
        return render(request, "prcs_create.html", {'process_form': form})
    
    elif request.method == 'POST' or request.method == 'FILES':
        form = ProcessForm(request.POST, request.FILES)
        if form.is_valid():
            prcs_instance = Process(bucketID = Bucket.objects.get(pk = bucketid))
            form = ProcessForm(request.POST, request.FILES, instance= prcs_instance)
            form.save()
            return redirect('bucketprocess', bucketid = bucketid)
            
def delete_bucketprcs(request, processid):
    process = get_object_or_404(Process, pk = processid)
    bucketid = process.bucketID.id
    process.delete()
    
    return redirect('bucketprocess', bucketid = bucketid)

def create_comment(request, bucketid, userid):
    form = CommentForm(request.POST)
    if form.is_valid():
        form = form.save(commit = False)
        form.bucketID = get_object_or_404(Bucket, pk = bucketid)
        form.userID = get_object_or_404(HaehooUser, pk = userid)
        form.save()
    return redirect('bucketprocess', bucketid = bucketid)
        