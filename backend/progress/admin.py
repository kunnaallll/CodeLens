from django.contrib import admin

from .models import Achievement, Progress, UserAchievement


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'algorithm', 'completed', 'score', 'completed_at')
    list_filter = ('completed', 'algorithm__category')
    search_fields = ('user__username', 'algorithm__name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'icon', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'code', 'description')


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ('user', 'achievement', 'unlocked_at')
    list_filter = ('achievement', 'unlocked_at')
    search_fields = ('user__username', 'achievement__name')
    readonly_fields = ('unlocked_at',)
