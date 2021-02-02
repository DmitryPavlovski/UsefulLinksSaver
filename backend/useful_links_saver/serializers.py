from rest_framework import serializers
from .models import Link, GroupLinks

class LinkSerializer(serializers.ModelSerializer):
  class Meta:
    model = Link
    fields = ('id', 'title', 'description', 'groupId', 'url')

class GroupLinksSerializer(serializers.ModelSerializer):
  class Meta:
    model = GroupLinks
    fields = ('id', 'title')