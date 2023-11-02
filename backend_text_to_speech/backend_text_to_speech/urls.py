from django.contrib import admin
from django.urls import path
from text_to_speech_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('transcribe-audio/', views.transcribe_audio, name='transcribe_audio')
]
