from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import HaehooUser

class HaehooUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm):
        model = HaehooUser
        fields = ('username', 'password', 'nickname')

class HaehooUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm):
        model = HaehooUser
        fields = ('username', 'password', 'nickname')
        
