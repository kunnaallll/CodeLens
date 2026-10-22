from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


class AnalyticsEndpointTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='learner', password='test-password')
        self.client.force_authenticate(self.user)

    def test_empty_account_receives_complete_analytics_shape(self):
        response = self.client.get('/api/analytics/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['accuracy'], 0)
        self.assertEqual(response.data['weak_areas'], [])
        self.assertEqual(len(response.data['weekly_activity']), 7)
        self.assertEqual(response.data['score_history'], [])
        self.assertIn('algorithm_completion', response.data)
        self.assertIn('challenge_performance', response.data)
