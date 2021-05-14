from django.db import models

# Create your models here.
class User(models.Model):
    gender = (
        ('male','男'),
        ('female','女'),
    )
    status = (
        ('normal','普通用户'),
        ('proprieter','社团负责人'),
        ('administrator','管理员'),
    )
    name = models.CharField(max_length=255,unique=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    sex = models.CharField(max_length=32,choices=gender,default="男")
    c_time = models.DateTimeField(auto_now_add=True)
    has_confirmed = models.BooleanField(default=False)
    user_type = models.CharField(max_length=255,choices=status,default='普通用户')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["-c_time"]
        verbose_name = "用户"
        verbose_name_plural = "用户"

class ConfirmString(models.Model):
    code = models.CharField(max_length=256)
    user = models.OneToOneField('User',on_delete=models.CASCADE)
    c_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.name + ":  " + self.code

    class Meta:
        ordering = ['-c_time']
        verbose_name = '确认码'
        verbose_name_plural = '确认码'