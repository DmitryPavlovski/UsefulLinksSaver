from django.db import models

# Create your models here.
class GroupLinks(models.Model):
  title = models.CharField(max_length=120)
  createdOn = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.title

class Link(models.Model):
  title = models.CharField(max_length=120, blank=True, null=True)
  description = models.TextField(blank=True, null=True)
  url = models.TextField(blank=True, null=True)
  groupId = models.ForeignKey(GroupLinks, on_delete=models.SET_NULL, null=True)
  createdOn = models.DateTimeField(auto_now_add=True)

  def _str_(self):
    return self.title
