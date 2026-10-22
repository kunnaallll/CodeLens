from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import Challenge, Question, Score, Submission


class ChallengeFlowTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='learner', password='test-password')
        self.client.force_authenticate(self.user)
        self.challenge = Challenge.objects.create(
            title='Sort these values',
            slug='sort-these-values',
            description='Sort the sample list.',
            difficulty='EASY',
            topic='sorting',
            input_data={'values': [3, 1, 2]},
            expected_answer=[1, 2, 3],
            best_algorithm='selection-sort',
            optimal_operations=5,
            allowed_algorithms=[],
        )
        self.question = Question.objects.create(
            challenge=self.challenge,
            prompt='Which option is correct?',
            choices=['yes', 'no'],
            correct_answer='yes',
            explanation='The first option is correct.',
        )

    def test_challenge_list_and_detail_supply_algorithm_choices(self):
        listing = self.client.get('/api/challenges/')
        self.assertEqual(listing.status_code, 200)
        rows = listing.data.get('results', listing.data)
        row = next(item for item in rows if item['id'] == self.challenge.id)
        self.assertIn('selection-sort', row['allowed_algorithms'])

        detail = self.client.get(f'/api/challenges/{self.challenge.slug}/')
        self.assertEqual(detail.status_code, 200)
        self.assertNotIn('expected_answer', detail.data)
        self.assertNotIn('correct_answer', detail.data['questions'][0])

    def test_submission_scores_server_counted_operations(self):
        response = self.client.post(
            f'/api/challenges/{self.challenge.id}/submit/',
            {
                'selected_algorithm': 'selection-sort',
                'submitted_answer': '[1, 2, 3]',
                'submitted_pseudocode': 'Loop over each position, find the minimum remaining value, then swap it into place.',
                'time_taken_seconds': 5,
                'operation_count': 999999,
            },
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_correct'])
        self.assertEqual(response.data['operation_count'], 5)
        self.assertEqual(response.data['optimal_operations'], 5)
        self.assertEqual(response.data['total_score'], 100)
        self.assertEqual(Submission.objects.count(), 1)
        self.assertEqual(Score.objects.get().total_score, 100)

    def test_correct_output_with_missing_pseudocode_does_not_pass(self):
        response = self.client.post(
            f'/api/challenges/{self.challenge.id}/submit/',
            {
                'selected_algorithm': 'selection-sort',
                'submitted_answer': '[1, 2, 3]',
                'submitted_pseudocode': 'Sort the values.',
                'time_taken_seconds': 5,
            },
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['output_correct'])
        self.assertFalse(response.data['pseudocode_correct'])
        self.assertFalse(response.data['is_correct'])

    def test_question_answer_is_checked_on_the_server(self):
        response = self.client.post(
            f'/api/challenges/questions/{self.question.id}/answer/',
            {'answer': 'yes'},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_correct'])
        self.assertIn('explanation', response.data)
