from django.db import models


# MEDIA_ADDR = 'http://localhost:8000/media/'
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
    head_image = models.ImageField(upload_to='user_head/',default='',verbose_name='头像')
    check_image = models.ImageField(upload_to='id_check/',default='id_check/check_default.png',verbose_name='身份信息卡')
    id_checked = models.BooleanField(default=False)


    def __str__(self):
        return self.name
    # def get_avatar_url(self):
    #     return MEDIA_ADDR + str(self.avatar)

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

class ChangePasswordConfirmString(models.Model):
    code = models.CharField(max_length=256)
    user = models.OneToOneField('User',on_delete=models.CASCADE)
    c_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.name + ":  " + self.code

    class Meta:
        ordering = ['-c_time']
        verbose_name = '修改密码确认码'
        verbose_name_plural = '修改密码确认码'