from django.test import SimpleTestCase

from .selection_sort import selection_sort, selection_sort_steps


class SelectionSortTests(SimpleTestCase):
    def test_sorts_values(self):
        self.assertEqual(selection_sort([64, 25, 12, 22, 11]), [11, 12, 22, 25, 64])

    def test_steps_end_with_sorted_values(self):
        result = selection_sort_steps([64, 25, 12, 22, 11])

        self.assertEqual(result[-1]['array'], [11, 12, 22, 25, 64])
