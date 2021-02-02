from django.contrib import admin
from .models import Link, GroupLinks

class LinkAdmin(admin.ModelAdmin):
  list_display = ['title', 'description', 'groupId', 'url']

class GroupLinksAdmin(admin.ModelAdmin):
  list_display = ['title']

admin.site.register(Link, LinkAdmin)
admin.site.register(GroupLinks, GroupLinksAdmin)
 
