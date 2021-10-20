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

class Comment(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE,verbose_name="评论文章")
    comment_context = models.TextField(verbose_name="评论内容")
    comment_author = models.ForeignKey(User, on_delete=models.DO_NOTHING,verbose_name="评论者")
    comment_time = models.DateTimeField(auto_now_add=True, verbose_name="评论时间")
    pre_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, verbose_name="父评论")

    def __str__(self):
        return self.comment_context

    class Mete:
        verbose_name = "评论"
        verbose_name_plural = verbose_name