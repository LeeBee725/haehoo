from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .forms import HaehooUserCreationForm, HaehooUserChangeForm
from .models import HaehooUser
# Register your models here.

class HaehooUserAdmin(UserAdmin):
    add_form = HaehooUserCreationForm
    form = HaehooUserChangeForm
    model = HaehooUser
    list_display = ['username', 'password', 'nickname']
    fieldsets = UserAdmin.fieldsets + (
            (None, {'fields': ('nickname',)}),
    ) 

admin.site.register(HaehooUser, HaehooUserAdmin)
