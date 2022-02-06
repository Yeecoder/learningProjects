from django.db import models

# Create your models here.

class ClubInfo(models.Model):

    clubname = models.CharField(max_length=255,unique=True)
    clubstar = models.FloatField()
    create_time = models.DateField()
    clubkind = models.CharField(max_length=255,default='体育运动类')
    clubimage = models.ImageField(upload_to='club_img/',verbose_name='社团图标',default='club_img/Club_default.png')
    clubinfo = models.FileField(upload_to='club_info/',verbose_name='社团详细信息',default='club_info/defaultpdf.pdf')
    def __str__(self):
        return self.clubname
