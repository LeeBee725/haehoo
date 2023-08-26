from django.shortcuts import render, redirect, get_object_or_404, reverse
from django.http import JsonResponse
from django.core.serializers import serialize
from django.core.paginator import Paginator
from django.core.paginator import InvalidPage

from account.models import HaehooUser
from bucket_list.models import Bucket
from bucket_list.models import BucketJSONEncoder

import json

def total(request):
    user_scraps = []
    login_user = None
    if request.user.is_authenticated:
        user_scraps = request.user.get_scrap_buckets()
        login_user = request.user.get_json()
    category_num = request.GET.get("category")
    if (category_num is None or category_num == "0"):
        total_bucket = Bucket.objects.order_by("-createdAt").all()
    else:
        total_bucket = Bucket.objects.order_by("-createdAt").filter(category=category_num)
    page = request.GET.get("page")
    BUCKET_PER_PAGE = 4
    paginator = Paginator(total_bucket, BUCKET_PER_PAGE)
    last = False
    if page and request.accepts("application/json"):
        try :
            paginator.validate_number(int(page))
            if paginator.num_pages == int(page):
                last = True
            data = paginator.page(page).object_list
            return JsonResponse({"message": "OK", "data": json.dumps(data, cls=BucketJSONEncoder), "login_user": login_user, "last": last})
        except InvalidPage:
            return JsonResponse({"message": "FAIL", "reason": "Invalid Page Number"})
    if paginator.num_pages == page:
        last = True
    buckets = paginator.page(1).object_list.all()
    return render(request, "total.html", {"total_bucket" : buckets, "user_scraps": user_scraps, "last": last})

def private(request, nickname):
    user_scraps = []
    if request.user.is_authenticated:
        user_scraps = request.user.get_scrap_buckets()
    user = HaehooUser.objects.filter(nickname = nickname)
    buckets = Bucket.objects.filter(user = user.get())
    ordered_records = Bucket.objects.filter(user = user.get()).order_by('-createdAt')
    return render(request, "private.html", {"nickname" : nickname, "buckets" : buckets, "ordered_records" : ordered_records, "user_scraps": user_scraps})

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
    if bucket.top_fixed is True:
        bucket.top_fixed = False
    else:
        bucket.top_fixed = True
    bucket.save()
    
    # return JsonResponse('private', nickname=nickname)
    # return JsonResponse({"message":"OK", "top_fixed":bucket in bucket.top_fixed.all()})
    return JsonResponse({"message":"OK", "top_fixed":bucket.top_fixed})

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
    derived = Bucket(
        user = user,
        title = request.POST["title"],
        category = request.POST["category"],
        derived_bucket = bucket
    )
    derived.save()
    return JsonResponse({ \
        "message": "OK", \
        "type": "create", \
        "scrap_cnt": bucket.deriving_bucket.all().count(), \
        "new_bucket": serialize("json", Bucket.objects.filter(pk=derived.id))
    })
