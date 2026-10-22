# This migration remains as the branch's migration marker; Submission is
# created by 0002_submission on the main migration path.
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('challenges', '0002_challenge_best_algorithm_challenge_expected_answer_and_more'),
    ]

    operations = []
