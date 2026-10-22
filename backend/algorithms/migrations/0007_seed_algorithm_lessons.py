from django.db import migrations


LESSONS = {
    'bubble-sort': (
        'Compare neighboring values and swap an out-of-order pair. After each pass, the largest remaining value is in its final position.',
        'for end from n - 1 down to 1:\n  changed = false\n  for i from 0 to end - 1:\n    if values[i] > values[i + 1]: swap them; changed = true\n  if not changed: stop',
        '[5, 2, 8, 1] becomes [1, 2, 5, 8].',
    ),
    'selection-sort': (
        'Keep a sorted prefix. Find the smallest value in the remaining suffix and swap it into the next prefix position.',
        'for start from 0 to n - 1:\n  smallest = start\n  for i from start + 1 to n - 1:\n    if values[i] < values[smallest]: smallest = i\n  swap values[start] and values[smallest]',
        '[4, 1, 3] selects 1 first, then produces [1, 3, 4].',
    ),
    'insertion-sort': (
        'Grow a sorted prefix one value at a time. Shift larger prefix values right to make room for the current value.',
        'for i from 1 to n - 1:\n  value = values[i]\n  shift larger values right\n  place value in the gap',
        '[4, 2, 3] inserts 2 before 4, then inserts 3 between them.',
    ),
    'merge-sort': (
        'Split the collection into halves until each part has one value. Merge the parts back together in sorted order.',
        'merge_sort(values):\n  if length <= 1: return values\n  split into left and right\n  return merge(merge_sort(left), merge_sort(right))',
        '[7, 2, 5, 1] splits into [7, 2] and [5, 1], then merges to [1, 2, 5, 7].',
    ),
    'quick-sort': (
        'Choose a pivot and partition values into those at or below it and those above it. Recursively sort each partition.',
        'quick_sort(low, high):\n  choose pivot\n  partition values around pivot\n  quick_sort(left partition)\n  quick_sort(right partition)',
        '[6, 2, 5] can use 5 as a pivot to form [2] and [6].',
    ),
    'linear-search': (
        'Check each value in sequence. Stop when the target is found or report that it is absent after the last value.',
        'for i from 0 to n - 1:\n  if values[i] == target: return i\nreturn -1',
        'Searching for 8 in [3, 8, 2] returns index 1.',
    ),
    'binary-search': (
        'On a sorted collection, compare the target with the middle value and discard the half that cannot contain it.',
        'low = 0; high = n - 1\nwhile low <= high:\n  middle = floor((low + high) / 2)\n  if values[middle] == target: return middle\n  keep only the half that may contain target\nreturn -1',
        'Searching for 7 in [2, 4, 6, 7, 9] returns index 3.',
    ),
    'bfs': (
        'Visit a graph in layers using a queue. Mark a vertex when it is enqueued so each vertex is visited once.',
        'queue = [start]; visited = {start}\nwhile queue is not empty:\n  node = queue.pop_front()\n  for each unvisited neighbor:\n    mark neighbor; queue.push_back(neighbor)',
        'For A → B, C and B → D, breadth-first order from A is A, B, C, D.',
    ),
    'dfs': (
        'Follow one path as far as possible before backtracking. A visited set prevents revisiting vertices in cyclic graphs.',
        'visit(node):\n  mark node visited\n  for each unvisited neighbor:\n    visit(neighbor)',
        'For A → B, C and B → D, depth-first order from A can be A, B, D, C.',
    ),
}


def seed_lessons(apps, schema_editor):
    Algorithm = apps.get_model('algorithms', 'Algorithm')
    for slug, (explanation, pseudocode, example) in LESSONS.items():
        Algorithm.objects.filter(slug=slug).update(
            explanation=explanation,
            pseudocode=pseudocode,
            example=example,
        )


class Migration(migrations.Migration):
    dependencies = [('algorithms', '0006_algorithm_learning_content')]
    operations = [migrations.RunPython(seed_lessons, migrations.RunPython.noop)]
