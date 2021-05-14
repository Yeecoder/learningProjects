from django.db import models

# Create your models here.

class ClubInfo(models.Model):

    clubname = models.CharField(max_length=255,unique=True)
    clubstar = models.FloatField()
    create_time = models.DateField()
    clubkind = models.CharField(max_length=255,default='体育运动类')
    # clubimage = models.ImageField()
    # clubinfo = models.FileField()
    def __str__(self):
        return self.clubname
