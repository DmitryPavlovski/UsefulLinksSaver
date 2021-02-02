from django.db import models

# Create your models here.
class GroupLinks(models.Model):
  title = models.CharField(max_length=120)

  def __str__(self):
    return self.title

class Link(models.Model):
  title = models.CharField(max_length=120)
  description = models.TextField()
  url = models.TextField()
  groupId = models.ForeignKey(GroupLinks, on_delete=models.SET_NULL, null=True)

  def _str_(self):
    return self.title
