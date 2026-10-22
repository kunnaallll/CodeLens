from django.test import SimpleTestCase

from .bubble_sort import bubble_sort_steps


class BubbleSortStepsTests(SimpleTestCase):
    def test_generates_sorted_final_state_and_counts_operations(self):
        result = bubble_sort_steps([5, 3, 8, 1])

        self.assertEqual(result['steps'][-1]['array'], [1, 3, 5, 8])
        self.assertGreater(result['comparisons'], 0)
        self.assertGreater(result['swaps'], 0)

    def test_does_not_mutate_the_input(self):
        values = [5, 3, 8, 1]

        bubble_sort_steps(values)

        self.assertEqual(values, [5, 3, 8, 1])
