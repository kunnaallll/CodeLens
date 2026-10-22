from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('algorithms', '0005_seed_learning_catalog'),
    ]

    operations = [
        migrations.AddField('algorithm', 'explanation', models.TextField(blank=True)),
        migrations.AddField('algorithm', 'pseudocode', models.TextField(blank=True)),
        migrations.AddField('algorithm', 'example', models.TextField(blank=True)),
        migrations.AddField('algorithm', 'visualization_steps', models.JSONField(blank=True, default=list)),
        migrations.AddField('algorithm', 'is_published', models.BooleanField(default=True)),
        migrations.AlterField('algorithm', 'is_published', models.BooleanField(default=False)),
    ]
