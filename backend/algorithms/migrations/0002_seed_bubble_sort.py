from django.db import migrations


def add_bubble_sort(apps, schema_editor):
    Algorithm = apps.get_model('algorithms', 'Algorithm')
    Algorithm.objects.get_or_create(
        name='Bubble Sort',
        defaults={
            'description': 'Sort a list by repeatedly comparing adjacent values and swapping them when they are out of order.',
            'category': 'Sorting',
            'time_complexity': 'O(n^2)',
            'space_complexity': 'O(1)',
        },
    )


class Migration(migrations.Migration):
    dependencies = [('algorithms', '0001_initial')]

    operations = [migrations.RunPython(add_bubble_sort, migrations.RunPython.noop)]
