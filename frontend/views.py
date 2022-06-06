from django.shortcuts import render
from django.views.generic.detail import DetailView

from api.models import Note


def index(request):
    return render(request, 'frontend/index.html')
