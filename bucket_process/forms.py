from django import forms
from .models import Process, Comment

class ProcessForm(forms.ModelForm):
    class Meta:
        model = Process
        fields = ['title', 'text', 'image']

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['comment']
