from django.shortcuts import render
from django.http import JsonResponse

def transcribe_audio(request):
    if request.method == "POST":
        audio_data = request.FILES.get("audio_file")

        openai_api_key = ""
