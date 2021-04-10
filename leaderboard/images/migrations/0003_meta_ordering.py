# Generated by Django 3.0.7 on 2020-10-19 00:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("images", "0002_add_image_enabled"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="image",
            options={"ordering": ["name"]},
        ),
        migrations.AlterField(
            model_name="image",
            name="name",
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
