from django.shortcuts import render
from rest_framework import viewsets
from .serializers import LinkSerializer, GroupLinksSerializer
from .models import Link, GroupLinks

class LinkView(viewsets.ModelViewSet):
  serializer_class = LinkSerializer
  queryset = Link.objects.all()

class GroupLinksView(viewsets.ModelViewSet):
  serializer_class = GroupLinksSerializer
  queryset = GroupLinks.objects.all()