from django.urls import path
from bucket_list import views

urlpatterns = [
    path("", views.total, name="total"),
    path("<str:nickname>/", views.private, name="private"),
    path("<str:nickname>/create/", views.create, name="create"),
    path("<str:nickname>/delete/<int:bucket_id>", views.delete, name="delete"),
    path("<str:nickname>/edit/<int:bucket_id>", views.edit, name="edit"),
    path("<str:nickname>/update/<int:bucket_id>", views.update, name="update"),
    path("<str:nickname>/like/<int:bucket_id>", views.click_like, name="click_like"),
    path("<str:nickname>/top_fixed/<int:bucket_id>", views.click_fix, name="click_fix"),
]
