from django.db import models
from account.models import HaehooUser
from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.query import QuerySet


class Bucket(models.Model):
    user = models.ForeignKey(HaehooUser, on_delete = models.CASCADE, related_name="buckets")
    title = models.CharField(max_length = 100)
    category = models.IntegerField()
    category_checkbox = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now = True)
    top_fixed = models.BooleanField(default=False)
    thumbnail_url = models.URLField(max_length=200, default=staticfiles_storage.url("image/bucket.svg"))
    liked_users = models.ManyToManyField(HaehooUser, blank = True, related_name="user-like-bucket+")
    derived_bucket = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, related_name="deriving_bucket")

    # ordered_records = models.objects.all().order_by('top_fixed')

    def category_to_str(self):
        str_list = ["", "하고 싶은 것", "먹고 싶은 것", "갖고 싶은 것", "가고 싶은 곳", "여행", "취미"]
        return str_list[self.category]
    
    def get_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": {
                "key": self.category,
                "value": self.category_to_str()
            },
            "category_checkbox": self.category_checkbox,
            "createAt": self.createdAt.ctime(),
            "top_fixed": self.top_fixed,
            "thumbnail_url": self.thumbnail_url,
            "liked_users": [user.get_json() for user in self.liked_users.all()],
            "deriving_bucket": [bucket.id for bucket in self.deriving_bucket.all()],
            "user": self.user.get_json()
        }

    def __str__(self):
        return f"{self.user}'s {self.title}"

    # def my_view(request):
    #     if request.method == 'POST':
    #         models = Bucket.category_checkbox(request.POST)
    #         if models.is_valid():
    #             checked_checkboxes = models.cleaned_data['category_checkbox']
    #         # process the checked checkboxes
    #     else:
    #         models = Bucket.category_checkbox()
    #     return (request, 'private.html', {'checked': models})

class BucketJSONEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, QuerySet):
            return tuple(obj)
        elif isinstance(obj, Bucket):
            return obj.get_json()
        elif isinstance(obj, HaehooUser):
            return obj.get_json()
        elif hasattr(obj, 'as_dict'):
            return obj.as_dict()
        return super().default(obj)