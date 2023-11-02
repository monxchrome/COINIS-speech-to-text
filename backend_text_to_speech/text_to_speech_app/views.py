from django.http import JsonResponse
import openai
from django.core.files.uploadedfile import InMemoryUploadedFile

def transcribe_audio(request):
    if request.method == "POST":
        audio_data = request.FILES.get("audio_file")

        if audio_data:
            try:
                openai.api_key = "sk-Lrxlqvgs9yourgUk357UT3BlbkFJNM0mFWjtrQRJgDPGYUHR"
                transcript = openai.Audio.transcribe("whisper-1", audio_data, response_format="text")

                return JsonResponse({'transcription': transcript})
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return JsonResponse({'error': 'No audio file provided'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)
