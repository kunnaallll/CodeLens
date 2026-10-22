from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('challenges', '0008_set_sorting_challenge_benchmark'),
    ]

    operations = [
        migrations.AddField(
            model_name='submission',
            name='submitted_pseudocode',
            field=models.TextField(blank=True, default=''),
        ),
    ]
