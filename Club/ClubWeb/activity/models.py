from django.db import models

from signinaout.models import User

# Create your models here.
class Activity(models.Model):
    title = models.CharField(max_length=255)
    context = models.TextField()
    publisher = models.ForeignKey(User,on_delete=models.CASCADE,default='bbb')
    publish_time = models.DateTimeField(auto_now_add=True)
    change_time = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.title