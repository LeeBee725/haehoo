from django.contrib import admin
from bucket_list.models import Bucket

from .models import Bucket

admin.site.register(Bucket)