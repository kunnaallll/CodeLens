from django.db import migrations


ALGORITHMS = (
    ('Bubble Sort', 'bubble-sort', 'Sorting', 'Repeatedly compare adjacent values and swap them when they are out of order.', 'O(n^2)', 'O(1)', 'O(n)', 'O(n^2)', 'O(n^2)', 'easy'),
    ('Selection Sort', 'selection-sort', 'Sorting', 'Select the smallest remaining value and place it at the next position.', 'O(n^2)', 'O(1)', 'O(n^2)', 'O(n^2)', 'O(n^2)', 'easy'),
    ('Insertion Sort', 'insertion-sort', 'Sorting', 'Build a sorted section by inserting each new value into its correct position.', 'O(n^2)', 'O(1)', 'O(n)', 'O(n^2)', 'O(n^2)', 'easy'),
    ('Merge Sort', 'merge-sort', 'Sorting', 'Split the array, sort each half, and merge the sorted halves.', 'O(n log n)', 'O(n)', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'medium'),
    ('Quick Sort', 'quick-sort', 'Sorting', 'Partition values around a pivot, then recursively sort each partition.', 'O(n log n)', 'O(log n)', 'O(n log n)', 'O(n log n)', 'O(n^2)', 'medium'),
    ('Linear Search', 'linear-search', 'Searching', 'Check values one at a time until the target is found or the list ends.', 'O(n)', 'O(1)', 'O(1)', 'O(n)', 'O(n)', 'easy'),
    ('Binary Search', 'binary-search', 'Searching', 'Repeatedly halve a sorted search range to find a target value.', 'O(log n)', 'O(1)', 'O(1)', 'O(log n)', 'O(log n)', 'easy'),
    ('Breadth-First Search', 'bfs', 'Graph', 'Visit graph vertices in expanding layers using a queue.', 'O(V + E)', 'O(V)', 'O(V + E)', 'O(V + E)', 'O(V + E)', 'medium'),
    ('Depth-First Search', 'dfs', 'Graph', 'Explore each path deeply before backtracking to another branch.', 'O(V + E)', 'O(V)', 'O(V + E)', 'O(V + E)', 'O(V + E)', 'medium'),
)

DATA_STRUCTURES = (
    ('Stack', 'stack', 'A last-in, first-out collection where values are added and removed at the top.', ['Push', 'Pop', 'Peek'], {'push': 'O(1)', 'pop': 'O(1)', 'peek': 'O(1)'}, 'O(n)'),
    ('Queue', 'queue', 'A first-in, first-out collection where values join at the rear and leave from the front.', ['Enqueue', 'Dequeue', 'Front'], {'enqueue': 'O(1)', 'dequeue': 'O(1)', 'front': 'O(1)'}, 'O(n)'),
    ('Linked List', 'linked-list', 'A sequence of nodes where each node links to the next node.', ['Insert', 'Delete', 'Traverse'], {'insert_at_head': 'O(1)', 'search': 'O(n)', 'delete': 'O(n)'}, 'O(n)'),
    ('Doubly Linked List', 'doubly-linked-list', 'A linked sequence whose nodes point to both the next and previous nodes.', ['Insert', 'Delete', 'Traverse'], {'insert_at_head': 'O(1)', 'search': 'O(n)', 'delete': 'O(n)'}, 'O(n)'),
    ('Binary Search Tree', 'binary-search-tree', 'A tree where smaller values go left and larger values go right.', ['Insert', 'Find', 'Traverse'], {'average_search': 'O(log n)', 'worst_search': 'O(n)'}, 'O(n)'),
)


def seed_catalog(apps, schema_editor):
    Algorithm = apps.get_model('algorithms', 'Algorithm')
    DataStructure = apps.get_model('algorithms', 'DataStructure')
    for name, slug, category, description, time_complexity, space_complexity, best, average, worst, difficulty in ALGORITHMS:
        Algorithm.objects.update_or_create(
            slug=slug,
            defaults={
                'name': name,
                'category': category,
                'description': description,
                'time_complexity': time_complexity,
                'space_complexity': space_complexity,
                'best_case': best,
                'average_case': average,
                'worst_case': worst,
                'difficulty': difficulty,
            },
        )
    for name, slug, description, operations, time_complexity, space_complexity in DATA_STRUCTURES:
        DataStructure.objects.update_or_create(
            slug=slug,
            defaults={
                'name': name,
                'description': description,
                'operations': operations,
                'time_complexity': time_complexity,
                'space_complexity': space_complexity,
            },
        )


class Migration(migrations.Migration):
    dependencies = [('algorithms', '0004_alter_algorithm_slug')]
    operations = [migrations.RunPython(seed_catalog, migrations.RunPython.noop)]
