# Generated by Django 3.2 on 2021-10-19 20:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('allclub', '0005_clubinfo_clubinfo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clubinfo',
            name='clubimage',
            field=models.ImageField(default='club_img/Club_default.png', upload_to='club_img/', verbose_name='社团图标'),
        ),
    ]
