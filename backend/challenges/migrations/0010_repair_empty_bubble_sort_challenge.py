from django.db import migrations


def repair_empty_bubble_sort_challenge(apps, schema_editor):
    Challenge = apps.get_model('challenges', 'Challenge')
    challenge = Challenge.objects.filter(slug='bubble-sort-challenge').first()
    if not challenge:
        return

    # Older local databases may contain this placeholder from before the demo
    # challenge seed was added. Fill it only when its answer/input were empty.
    if not challenge.input_data and not challenge.expected_answer:
        challenge.description = 'Sort the values from smallest to largest. Enter the result as a comma-separated list.'
        challenge.input_data = {'values': [9, 4, 7, 2, 6]}
        challenge.expected_output = '[2, 4, 6, 7, 9]'
        challenge.expected_answer = [2, 4, 6, 7, 9]
        challenge.target = None
        challenge.topic = 'sorting'
        challenge.best_algorithm = 'bubble-sort'
        challenge.optimal_operations = 17
        challenge.allowed_algorithms = ['bubble-sort', 'selection-sort', 'insertion-sort']
        challenge.time_limit_seconds = 120
        challenge.save()


class Migration(migrations.Migration):
    dependencies = [
        ('challenges', '0009_submission_submitted_pseudocode'),
    ]

    operations = [
        migrations.RunPython(repair_empty_bubble_sort_challenge, migrations.RunPython.noop),
    ]
