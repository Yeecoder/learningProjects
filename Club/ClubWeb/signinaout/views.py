from django.shortcuts import render,redirect

from . import models
from . import forms
from django.conf import settings

import hashlib
import datetime

# Create your views here.

def make_confirm_string(user):
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # 将用户名和当前时间作为主体和盐，生成验证码
    code = hash_code(user.name,now)
    # 保存用户的验证码
    models.ConfirmString.objects.create(code=code,user=user)
    return code

def send_email(email,code):
    from django.core.mail import EmailMultiAlternatives
    # 邮件主题
    subject = '来自localhost:8000/allclubs的注册确认邮件'
    # 文本格式的邮件内容
    text_content = '''感谢注册localhost:8000/allclubs，这里是社团资讯中心，专注于最新最全面的社团活动等信息分享！\
                        如果你看到这条消息，说明你的邮箱服务器不提供HTML链接功能，请联系管理员！'''
    # html格式的邮件内容
    html_content = '''
                        <p>感谢注册<a href="http://{}info/confirm/?code={}" target=blank>localhost:8000/allclubs</a>，\
                        这里是社团资讯中心，专注于最新最全面的社团活动等信息分享！</p>
                        <p>请点击站点链接完成注册确认！</p>
                        <p>此链接有效期为{}天！</p>
                        '''.format('localhost:8000/', code, settings.CONFIRM_DAYS)
    # 将邮件信息打包
    msg = EmailMultiAlternatives(subject, text_content, settings.EMAIL_HOST_USER, [email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

# 密码加密
def hash_code(s,salt='Clubs'):
    # salt增加密码的复杂程度，使用sha256加密
    h = hashlib.sha256()
    s += salt
    h.update(s.encode())
    return h.hexdigest()

# login func
def login(request):
    # 使用session 不允许重复登录
    if request.session.get('is_login',None):
        return redirect('/allclubs/')
    # 判断请求方式
    if request.method == 'POST':
        # 实例化form表单
        login_form = forms.UserForm(request.POST)
        message = '请检查填写的内容！'
        if login_form.is_valid():
            # 完成数据格式校验
            username = login_form.cleaned_data.get('username')
            password = login_form.cleaned_data.get('password')
            try:
                user = models.User.objects.get(name=username)
            except:
                message = '用户名不存在'
                return render(request,'signinaout/login.html', locals())

            if not user.has_confirmed:
                message = '该用户还未经过邮件确认！'
                return render(request, 'signinaout/login.html', locals())

            # 判定输入密码和数据库中密码一致
            if user.password == hash_code(password):
                request.session['is_login'] = True
                request.session['user_id'] = user.id
                request.session['user_name'] = user.name
                # 如果密码正确就重定向到/allclubs/页面
                return redirect('/allclubs/')
            else:
                message = '密码不正确'
                return render(request,'signinaout/login.html', locals())
        else:
            return render(request,'signinaout/login.html',locals())
    login_form = forms.UserForm()
    return render(request,'signinaout/login.html', locals())

# logout func
def logout(request):
    # 如果未登录就没必要退出了，重定向到登陆界面
    if not request.session.get('is_login',None):
        return redirect('/info/login/')
    # 清空session信息
    request.session.flush()
    # 返回退出页面
    return render(request,'signinaout/logout.html')
# register func
def register(request):
    # 如果已经登录了就不再允许注册
    if request.session.get('is_login',None):
        return redirect('/allclubs/')
    # 如果没有登录并且有提交信息
    if request.method == 'POST':
        # 实例化表单
        register_form = forms.RegisterForm(request.POST,request.FILES)
        print(register_form)
        message = '请检查填写的内容！'
        # 对表单内容进行校验
        if register_form.is_valid():
            print('已经进入校验')
            username = register_form.cleaned_data.get('username')
            password1 = register_form.cleaned_data.get('password1')
            password2 = register_form.cleaned_data.get('password2')
            email = register_form.cleaned_data.get('email')
            sex = register_form.cleaned_data.get('sex')
            head_image = register_form.cleaned_data.get('head_image')
            # 判断第一次和第二次输入的密码是否是同一个
            if password1 != password2:
                message = '两次输入的密码不同！'
                return render(request,'signinaout/register.html',locals())
            else:
                same_name_user = models.User.objects.filter(name=username)
                if same_name_user:
                    message = '用户名已经存在'
                    return render(request,'signinaout/register.html',locals())
                same_email_user = models.User.objects.filter(email=email)
                if same_email_user:
                    message = '该邮箱已经被注册了！'
                    return render(request, 'signinaout/register.html', locals())

                new_user = models.User()
                new_user.name = username
                new_user.password = hash_code(password1)
                new_user.email = email
                new_user.sex = sex
                new_user.head_image = head_image
                new_user.head_image.name = new_user.name + datetime.datetime.now().strftime('%Y%m%d%H%m') + '.' + new_user.head_image.name.split('.')[-1]
                new_user.save()

                # 生成邮箱确认码
                code = make_confirm_string(new_user)
                # 发送确认码
                send_email(email,code)

                message = '请前往邮箱进行确认'

                return redirect('/info/login/')
        else:
            return render(request,'signinaout/register.html',locals())
    # 如果没有登录并且没有上传信息
    register_form = forms.RegisterForm()
    return render(request,'signinaout/register.html',locals())

def changes(request):

    return render(request,'signinaout/changes.html')
# user_confirm func
def user_confirm(request):
    # 从用户在邮件中点击的连接中获取验证码
    code = request.GET.get('code',None)
    message = ''
    try:
        confirm = models.ConfirmString.objects.get(code=code)
    except:
        # 如果找不到对应确认码的用户，进行反馈
        message = '无效的确认请求！'
        return render(request,'signinaout/confirm.html',locals())

    c_time = confirm.c_time
    now = datetime.datetime.now()
    # 如果现在的时间已经超过了确认码的有效期限，则反馈重新注册
    if now > c_time + datetime.timedelta(settings.CONFIRM_DAYS):
        confirm.user.delete()
        message = '您的邮件已经过期！请重新注册！'
        return render(request,'signinaout/confirm.html',locals())
    else:
        # 如果还在有效期内，则将用户状态改为已确认，并保存用户信息，删除确认码
        confirm.user.has_confirmed = True
        confirm.user.save()
        confirm.delete()
        message = '确认完成，请使用账户登录！'
        return render(request,'signinaout/confirm.html',locals())