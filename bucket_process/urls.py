from django.urls import path
from bucket_process import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("<int:bucketid>/", views.show_bucketprcs, name = 'bucketprocess'),
    path("<int:bucketid>/create/", views.create_bucketprcs, name = 'processcreate'),
    path("<int:processid>/delete/", views.delete_bucketprcs, name = 'processdelete'),
    path("<int:bucketid>/createcomment/<int:userid>", views.create_comment, name = 'createcomment'),
    
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)