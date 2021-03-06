# Generated by Django 3.2.3 on 2021-05-20 14:07

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='connection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('src', models.GenericIPAddressField()),
                ('dst', models.GenericIPAddressField()),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('all_size', models.PositiveIntegerField()),
                ('status', models.BooleanField(db_index=True)),
                ('address', models.CharField(db_index=True, max_length=64)),
                ('app', models.CharField(db_index=True, max_length=256)),
                ('upload', models.BooleanField(db_index=True)),
                ('download', models.BooleanField(db_index=True)),
            ],
        ),
        migrations.CreateModel(
            name='device',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.PositiveIntegerField()),
                ('description', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='flow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('src', models.GenericIPAddressField()),
                ('dst', models.GenericIPAddressField()),
                ('time', models.DateTimeField()),
                ('size', models.PositiveIntegerField()),
                ('upload', models.BooleanField(db_index=True)),
                ('download', models.BooleanField(db_index=True)),
            ],
        ),
    ]
