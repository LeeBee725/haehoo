from django.db import models
from account.models import HaehooUser
from django.contrib.staticfiles.storage import staticfiles_storage

class Bucket(models.Model):
    user = models.ForeignKey(HaehooUser, on_delete = models.CASCADE, related_name="buckets")
    title = models.CharField(max_length = 100)
    category = models.IntegerField()
    category_checkbox = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now = True)
    top_fixed = models.BooleanField(default=False)
    thumbnail_url = models.URLField(max_length=200, default=staticfiles_storage.url("image/no_image.svg"))
    liked_users = models.ManyToManyField(HaehooUser, blank = True, related_name="user-like-bucket+")
    derived_bucket = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, related_name="deriving_bucket")

    # ordered_records = models.objects.all().order_by('top_fixed')

    def category_to_str(self):
        str_list = ["", "하고 싶은 것", "먹고 싶은 것", "갖고 싶은 것", "가고 싶은 곳", "여행", "취미"]
        return str_list[self.category]

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