import os
from django.core.mail import EmailMultiAlternatives

os.environ['DJANGO_SETTINGS_MODULE'] = 'ClubWeb.settings'

if __name__ == '__main__':
    subject, from_email, to = '来自ClubWeb的测试邮件', 'xxx@163.com', 'xxx@qq.com'
    text_content = '欢迎访问localhost:8000/allclubs浏览更多社团资讯'
    html_content = '<p>欢迎访问<a href="http://localhost:8000/allclubs" target=blank>localhost:8000/allclubs</a>浏览更多社团资讯</p>'
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()