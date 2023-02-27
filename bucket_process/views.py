from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.staticfiles.storage import staticfiles_storage


from bucket_list.models import Bucket
from account.models import HaehooUser
from .models import Process, Comment
from .forms import ProcessForm, CommentForm

def show_bucketprcs(request, bucketid):
    total_process = Process.objects.filter(bucket = bucketid)
    bucket = Bucket.objects.get(pk = bucketid)
    
    total_comment = Comment.objects.filter(bucket = bucketid)
    
    comment_form = CommentForm()

    user_scraps = None
    if request.user.is_authenticated:
        user_scraps = request.user.buckets.filter(derived_bucket__isnull=False) \
                        .values_list("derived_bucket_id", flat=True)
    
    return render(request, "prcs_popup.html",{'total_process' : total_process, 'bucket' : bucket, 'total_comment' : total_comment,"comment_form" : comment_form, "user_scraps":user_scraps})

def create_bucketprcs(request, bucketid):
    if request.method == 'GET':
        form = ProcessForm()    
        return render(request, "prcs_create.html", {'process_form': form})
    
    elif request.method == 'POST' or request.method == 'FILES':
        form = ProcessForm(request.POST, request.FILES)
        if form.is_valid():
            bucket = Bucket.objects.get(pk = bucketid)
            prcs_instance = Process(bucket = bucket)
            form = ProcessForm(request.POST, request.FILES, instance= prcs_instance)
            form.save()
            bucket.thumbnail_url = prcs_instance.image.url
            bucket.save()
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
    deleted_url = process.image.url
    bucket = Bucket.objects.get(pk=process.bucket.id)
    process.delete()
    if (deleted_url == bucket.thumbnail_url):
        img_of_processes = bucket.processes.filter(image__isnull=False)
        if (not img_of_processes):
            bucket.thumbnail_url = staticfiles_storage.url("image/bucket.svg")
        else :
            bucket.thumbnail_url = img_of_processes.latest("createdAt").image.url
        bucket.save()
    return redirect('bucketprocess', bucketid = bucket.id)

def create_comment(request, bucketid, userid):
    print('here')
    form = CommentForm(request.POST)
    if form.is_valid():
        form = form.save(commit = False)
        form.bucket = get_object_or_404(Bucket, pk = bucketid)
        form.user = get_object_or_404(HaehooUser, pk = userid)
        form.save()
        return JsonResponse({"success":True})
          
def delete_comment(request, commentid):
    comment = get_object_or_404(Comment, pk = commentid)
    comment.delete()
    
    return JsonResponse({"success":True})

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
        
