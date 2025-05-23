# Generated by Django 5.1.7 on 2025-04-12 10:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_hp_students_delete_student'),
    ]

    operations = [
        migrations.CreateModel(
            name='HPGhiDanh',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('tgbdgd', models.DateField()),
                ('tgktgd', models.DateField()),
            ],
            options={
                'db_table': 'ds_hpghidanh',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='KQGhidanh',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('thaotac', models.CharField(max_length=4)),
                ('tgthaotac', models.DateTimeField()),
            ],
            options={
                'db_table': 'kq_ghidanh',
                'managed': False,
            },
        ),
    ]
