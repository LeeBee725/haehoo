from django.contrib import admin
from django.urls import path, include, re_path as url
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("main.urls")),
    path("account/", include("account.urls")),
    path("bucket-list/", include("bucket_list.urls")),
    path("customer-support/", include("customer_support.urls")),
    path("bucketprocess/", include("bucket_process.urls")),

    url(r'^media/(?P<path>.*)$', serve, {'document_root':settings.MEDIA_ROOT}),
    url(r'^static/(?P<path>.*)$', serve, {'document_root':settings.STATIC_ROOT}),
]
