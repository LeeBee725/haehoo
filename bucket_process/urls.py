from django.urls import path
from bucket_process import views

urlpatterns = [
    path("<int:bucketid>/", views.show_bucketprcs, name = 'bucketprocess'),
    path("<int:bucketid>/create", views.create_bucketprcs, name = 'processcreate'),
    path("<int:processid>/edit", views.edit_bucketprcs, name = 'processedit'),
    path("<int:processid>/delete", views.delete_bucketprcs, name = 'processdelete'),
    path("<int:bucketid>/createcomment/<int:userid>", views.create_comment, name = 'createcomment'),
    path("deletecomment/<int:commentid>", views.delete_comment, name = 'deletecomment'),
    path("updatecomment/<int:commentid>", views.update_comment, name = 'updatecomment'),

]


