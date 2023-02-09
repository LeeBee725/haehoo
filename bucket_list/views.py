from django.shortcuts import render, redirect, get_object_or_404, reverse
from django.http import JsonResponse
from django.core import serializers
from account.models import HaehooUser
from bucket_list.models import Bucket
import json

def total(request):
    user_scraps = None
    if request.user.is_authenticated:
        user_scraps = request.user.buckets.filter(derived_bucket__isnull=False) \
                        .values_list("derived_bucket_id", flat=True)
    total_bucket = Bucket.objects
    return render(request, "total.html", {"total_bucket" : total_bucket, "user_scraps": user_scraps})

def private(request, nickname):
    user = HaehooUser.objects.filter(nickname = nickname)
    buckets = Bucket.objects.filter(user = user.get())
    return render(request, "private.html", {"nickname" : nickname, "buckets" : buckets})

def create(request, nickname):
    if request.method == "POST":
        user = HaehooUser.objects.filter(nickname=nickname)
        title = request.POST["title"]
        category = int(request.POST["category"])
        newBucket = Bucket(
            title = title,
            category = category
        )
        newBucket.user = user.get()
        newBucket.save()
        # top_fixed = request.POST.getlist('top_fixed')
        # class Meta:
        #     model = Bucket
        #     fields = ['title', 'category', 'top_fixed']

        return redirect('private', nickname=nickname)
        return redirect("private", nickname=nickname)
    else:
        return render(request, "create.html", {"nickname" : nickname})


def delete(request, nickname, bucket_id):
    bucket = get_object_or_404(Bucket, pk = bucket_id)
    bucket.delete()

    return redirect("private", nickname=nickname)

def edit(request, nickname, bucket_id):
    edit_bucket = Bucket.objects.get(id = bucket_id)

    return render(request, "edit.html", {"bucket" : edit_bucket, "nickname" : nickname})

def update(request, nickname, bucket_id):
    user = HaehooUser.objects.filter(nickname=nickname)
    edit_bucket = Bucket.objects.get(id=bucket_id)
    edit_bucket.title = request.POST.get("title")
    edit_bucket.category = request.POST["category"]

    edit_bucket.user = user.get()
    edit_bucket.save()

    return redirect("private", nickname=nickname)

def click_like(request, nickname, bucket_id):
    if request.method != "POST":
        return JsonResponse({"status_code": 404, "error": "Permission denied"})
    bucket = Bucket.objects.get(pk=bucket_id)
    user = HaehooUser.objects.get(nickname=nickname)
    if user in bucket.liked_users.all():
        bucket.liked_users.remove(user)
    else:
        bucket.liked_users.add(user)
    bucket.save()
    return JsonResponse({"message":"OK", "is_contains":user in bucket.liked_users.all(), "like_cnt":bucket.liked_users.count()})

def click_fix(request, nickname, bucket_id):
    bucket = Bucket.objects.get(pk=bucket_id)
    user = HaehooUser.objects.get(nickname=nickname)
    if user in bucket.top_fixed.all():
        bucket.top_fixed.remove(user)
    else:
        bucket.top_fixed.add(user)
    bucket.save()
    return JsonResponse({"message":"OK", "is_contains":user in bucket.top_fixed.all()})

# def get_context_data(self, **kwargs):
#     bucket_fixed = Bucket.objects.filter(top_fixed=True).order_by('-registered_date')
#     Bucket['bucket_fixed'] = bucket_fixed

# def show_top_fixed_bucket(request):
# 	postlist = Bucket.objects.all()
#     return render(request,'private', {'postlist':postlist})

def click_scrap(request, nickname, bucket_id):
    if not request.user.is_authenticated:
        return redirect(reverse("login"))
    bucket = Bucket.objects.get(pk=bucket_id)
    user = HaehooUser.objects.get(nickname=nickname)
    if (bucket.user.nickname == user.nickname):
        return redirect(reverse("total") + "?fail=same_user_scrap")
    if request.method != "POST":
        return JsonResponse({"status_code": 404, "error": "Permission denied"})
    user_scraps = request.user.buckets.filter(derived_bucket__isnull=False) \
                        .values_list("derived_bucket_id", flat=True)
    if bucket.id in user_scraps:
        deleted = user.buckets.filter(derived_bucket=bucket.id)
        deleted_id = deleted.get().id
        deleted.delete()
        return JsonResponse({ \
            "message": "OK", \
            "type": "delete", \
            "scrap_cnt": bucket.deriving_bucket.all().count(), \
            "deleted_bucket_id": deleted_id
        })
    data = json.loads(request.body)
    derived = Bucket(
        user = user,
        title = data["title"],
        category = data["category"],
        derived_bucket = bucket
    )
    derived.save()
    return JsonResponse({ \
        "message": "OK", \
        "type": "create", \
        "scrap_cnt": bucket.deriving_bucket.all().count(), \
        "new_bucket": serializers.serialize("json", Bucket.objects.filter(pk=derived.id))
    })