from django.db import migrations


CHALLENGES = (
    {
        'title': 'Put the numbers in order',
        'slug': 'put-the-numbers-in-order',
        'description': 'Sort the values from smallest to largest. Enter the result as a comma-separated list.',
        'difficulty': 'EASY',
        'points': 100,
        'input_data': {'values': [9, 4, 7, 2, 6]},
        'expected_output': '[2, 4, 6, 7, 9]',
        'expected_answer': [2, 4, 6, 7, 9],
        'topic': 'sorting',
        'best_algorithm': 'insertion-sort',
        'time_limit_seconds': 120,
        'allowed_algorithms': ['bubble-sort', 'selection-sort', 'insertion-sort'],
    },
    {
        'title': 'Find the target with binary search',
        'slug': 'find-the-target-with-binary-search',
        'description': 'Find the target in the sorted values. Enter its zero-based index.',
        'difficulty': 'MEDIUM',
        'points': 100,
        'input_data': {'values': [2, 4, 6, 7, 9]},
        'target': 7,
        'expected_output': '3',
        'expected_answer': 3,
        'topic': 'searching',
        'best_algorithm': 'binary-search',
        'time_limit_seconds': 90,
        'allowed_algorithms': ['linear-search', 'binary-search'],
    },
    {
        'title': 'Trace a breadth-first traversal',
        'slug': 'trace-a-breadth-first-traversal',
        'description': 'Starting at A, list the vertices in breadth-first order. Separate values with commas.',
        'difficulty': 'MEDIUM',
        'points': 100,
        'input_data': {'graph': {'A': ['B', 'C'], 'B': ['D'], 'C': ['E'], 'D': [], 'E': []}},
        'expected_output': '["A", "B", "C", "D", "E"]',
        'expected_answer': ['A', 'B', 'C', 'D', 'E'],
        'topic': 'graph',
        'best_algorithm': 'bfs',
        'time_limit_seconds': 90,
        'allowed_algorithms': ['bfs', 'dfs'],
    },
)


def seed_challenges(apps, schema_editor):
    Challenge = apps.get_model('challenges', 'Challenge')
    Question = apps.get_model('challenges', 'Question')
    for values in CHALLENGES:
        challenge, _ = Challenge.objects.update_or_create(
            slug=values['slug'], defaults=values
        )
        if challenge.slug == 'put-the-numbers-in-order':
            Question.objects.get_or_create(
                challenge=challenge,
                order=1,
                defaults={
                    'prompt': 'Which complexity describes Bubble Sort in the average case?',
                    'choices': ['O(n)', 'O(n log n)', 'O(n^2)'],
                    'correct_answer': 'O(n^2)',
                    'explanation': 'Bubble Sort may compare and swap adjacent values across multiple passes.',
                },
            )


class Migration(migrations.Migration):
    dependencies = [
        ('algorithms', '0005_seed_learning_catalog'),
        ('challenges', '0006_challenge_optimal_operations'),
    ]
    operations = [migrations.RunPython(seed_challenges, migrations.RunPython.noop)]
