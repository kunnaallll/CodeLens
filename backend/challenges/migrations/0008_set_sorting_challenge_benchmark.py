from django.db import migrations


def set_benchmark(apps, schema_editor):
    Challenge = apps.get_model('challenges', 'Challenge')
    Challenge.objects.filter(slug='put-the-numbers-in-order').update(
        best_algorithm='selection-sort',
        optimal_operations=13,
    )


class Migration(migrations.Migration):
    dependencies = [
        ('challenges', '0007_seed_demo_challenges'),
    ]

    operations = [migrations.RunPython(set_benchmark, migrations.RunPython.noop)]
