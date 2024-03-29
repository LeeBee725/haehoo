from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.paginator import Paginator
from django.core import serializers

from bucket_list.models import Bucket
from account.models import HaehooUser
from .models import Process, Comment
from .forms import ProcessForm, CommentForm

def show_bucketprcs(request, bucketid):
    total_process = Process.objects.filter(bucket = bucketid)
    bucket = Bucket.objects.get(pk = bucketid)
    
    total_comment = Comment.objects.filter(bucket = bucketid).order_by('-createdAt')
    
    comment_form = CommentForm()

    user_scraps = None
    if request.user.is_authenticated:
        user_scraps = request.user.buckets.filter(derived_bucket__isnull=False) \
                        .values_list("derived_bucket_id", flat=True)
    
    cmnt_page = request.GET.get('cmnt_pg')
    if cmnt_page == None:
        print("cmnt_pg is None")
        return render(request, "prcs_popup.html",{'total_process' : total_process, 'bucket' : bucket, 'total_comment' : total_comment,"comment_form" : comment_form, "user_scraps":user_scraps})
    else:
        paginator = Paginator(total_comment, 3)
        cmnt_per_page = paginator.page(cmnt_page)
        return render(request, "prcs_popup.html",{'total_process' : total_process, 'bucket' : bucket, 'total_comment' :cmnt_per_page,"comment_form" : comment_form, "user_scraps":user_scraps})

def create_bucketprcs(request, bucketid): 
    print("method:",request.method)   
    print("post:",request.POST)   
    print("FILES:",request.FILES)   
    
    if request.method == 'POST':
        form = ProcessForm(request.POST)
        if form.is_valid():
            form = form.save(commit = False)
            prcs_id = form.id
            form.bucket = get_object_or_404(Bucket, pk = bucketid)
            if request.FILES:
                form.image = request.FILES['image']
                form.save()
                form.bucket.thumbnail_url = form.image.url
                form.bucket.save()
                print('newid:', prcs_id)
                print("image :",type(form.image.url))
                return JsonResponse({"success":True, "title":request.POST['title'], 'text':request.POST['text'], 'image':form.image.url, 'createdat': form.createdAt})
            else:
                new_prcs = form.save()
                return JsonResponse({"success":True, "title":request.POST['title'], 'text':request.POST['text'], 'image':'', 'createdat': form.createdAt})

    else: 
        print("request method is not POST")
        return JsonResponse({"success":False})

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
    
    deleted_url = None
    if process.image != '':
        deleted_url = process.image.url
    
    bucket = Bucket.objects.get(pk=process.bucket.id)
    process.delete()
    if (deleted_url == bucket.thumbnail_url ):
        img_of_processes = bucket.processes.filter(image__isnull=False)
        if (not img_of_processes):
            bucket.thumbnail_url = staticfiles_storage.url("image/bucket.svg")
        else :
            bucket.thumbnail_url = img_of_processes.latest("createdAt").image.url
        bucket.save()
    return JsonResponse({"success":True})

def create_comment(request, bucketid, userid):
    form = CommentForm(request.POST)
    if form.is_valid():
        form = form.save(commit = False)
        form.bucket = get_object_or_404(Bucket, pk = bucketid)
        form.user = get_object_or_404(HaehooUser, pk = userid)
        form.save()
        return JsonResponse({"success":True, "newcomment":request.POST['comment'], "id":form.id, "userid":form.user.id, "nickname":form.user.nickname})
          
def delete_comment(request, commentid):
    comment = get_object_or_404(Comment, pk = commentid)
    comment.delete()
    
    return JsonResponse({"success":True})

def update_comment(request, commentid):
    comment = Comment.objects.get(pk = commentid)
    if request.method != "POST":
        print("save fail")
        return JsonResponse({"success":False})
    
    elif request.method == 'POST':                
        newcomment = request.POST['comment']        
        comment.comment = newcomment
        comment.save()
        
        print("save success")
        return JsonResponse({"success":True, "newcomment":newcomment})
        
