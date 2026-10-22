from django.contrib import admin

from .models import Challenge, Question, Score, Submission


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 0


@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('title', 'topic', 'difficulty', 'points', 'time_limit_seconds', 'optimal_operations', 'updated_at')
    list_filter = ('topic', 'difficulty')
    search_fields = ('title', 'slug', 'description')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    inlines = (QuestionInline,)


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'challenge', 'chosen_algorithm', 'is_correct', 'score', 'submitted_at')
    list_filter = ('is_correct', 'challenge__topic', 'submitted_at')
    search_fields = ('user__username', 'challenge__title', 'chosen_algorithm')
    readonly_fields = ('user', 'challenge', 'chosen_algorithm', 'time_taken', 'submitted_answer', 'submitted_pseudocode', 'is_correct', 'score', 'submitted_at', 'operation_count')

    def has_add_permission(self, request):
        return False


@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ('user', 'submission', 'total_score', 'points_awarded', 'created_at')
    list_filter = ('total_score', 'created_at')
    search_fields = ('user__username', 'submission__challenge__title')
    readonly_fields = ('user', 'submission', 'total_score', 'correctness_score', 'efficiency_score', 'speed_score', 'points_awarded', 'created_at')

    def has_add_permission(self, request):
        return False
