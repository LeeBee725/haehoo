from django.urls import path
from main import views

urlpatterns = [
    path("", views.main, name='main'),
    path("guide/", views.guide, name='guide'),
    path("prepare/", views.prepare, name='prepare')
]