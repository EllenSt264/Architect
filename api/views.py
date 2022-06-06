from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
import json

from .models import Note
from .serializers import NoteSerializer


@api_view(['GET', 'POST'])
def getNotes(request):
    """Get notes and create new ones."""
    if request.method == 'GET':
        # notes must be serialized before passing it into the response so that json can read it
        notes = Note.objects.all().order_by('-updated')
        serializer = NoteSerializer(notes, many=True)
        # serializer is an object so we use '.data' to access it
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        data = request.data

        if data['body'] and not data['body'].isspace():
            note = Note.objects.create(body=data['body'])
            # notes must be serialized before passing it into the response
            # # so that json can read it
            serializer = NoteSerializer(instance=note, data=data, many=False)

            if serializer.is_valid():
                serializer.save()
                # serializer is an object so we use '.data' to access it
                return Response(
                    serializer.data, status=status.HTTP_201_CREATED)
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)

    # Request method error
    return HttpResponse(json.dumps({'detail': 'Wrong method'}),
                        status=status.HTTP_501_NOT_IMPLEMENTED)


@api_view(['GET'])
def getNote(request, pk):
    if request.method == 'GET':
        notes = Note.objects.get(id=pk)
        serializer = NoteSerializer(notes, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
