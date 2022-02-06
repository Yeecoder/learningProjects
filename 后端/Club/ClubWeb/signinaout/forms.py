from django import forms
from captcha.fields import CaptchaField

class UserForm(forms.Form):
    username = forms.CharField(label="用户名",max_length=255)
    password = forms.CharField(label="密码",max_length=255,widget=forms.PasswordInput)
    captcha = CaptchaField(label='验证码')

class RegisterForm(forms.Form):
    gender = (
        ('male', "男"),
        ('female', "女"),
    )
    username = forms.CharField(label="用户名", max_length=128, widget=forms.TextInput())
    password1 = forms.CharField(label="密码", max_length=256, widget=forms.PasswordInput())
    password2 = forms.CharField(label="确认密码", max_length=256,
                                widget=forms.PasswordInput())
    email = forms.EmailField(label="邮箱地址", widget=forms.EmailInput())
    sex = forms.ChoiceField(label='性别', choices=gender)
    captcha = CaptchaField(label='验证码')
    head_image = forms.ImageField(label='用户头像')

class ChangeForm(forms.Form):
    gender = (
        ('male', "男"),
        ('female', "女"),
    )
    email = forms.EmailField(label="邮箱地址", widget=forms.EmailInput())
    sex = forms.ChoiceField(label='性别', choices=gender)

class IdCkeckForm(forms.Form):
    check_image = forms.ImageField(label='身份验证信息')

class ChangePassword(forms.Form):
    email = forms.EmailField(label="邮箱地址", widget=forms.EmailInput())
    new_password = forms.CharField(label="新密码", max_length=256, widget=forms.PasswordInput())
    # old_password = forms.CharField(label="原密码", max_length=256, widget=forms.PasswordInput())
    captcha = CaptchaField(label='验证码')