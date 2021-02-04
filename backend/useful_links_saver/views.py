from django.shortcuts import render
from rest_framework import viewsets
from .serializers import LinkSerializer, GroupLinksSerializer
from .models import Link, GroupLinks

class LinkView(viewsets.ModelViewSet):
  serializer_class = LinkSerializer
  queryset = Link.objects.order_by('-createdOn')

class GroupLinksView(viewsets.ModelViewSet):
  serializer_class = GroupLinksSerializer
  queryset = GroupLinks.objects.order_by('-createdOn')