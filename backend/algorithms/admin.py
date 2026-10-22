from django.contrib import admin

from .models import Algorithm, DataStructure


@admin.register(Algorithm)
class AlgorithmAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'difficulty', 'is_published', 'time_complexity', 'space_complexity', 'updated_at')
    list_filter = ('category', 'difficulty', 'is_published')
    search_fields = ('name', 'description', 'explanation', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')


@admin.register(DataStructure)
class DataStructureAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'updated_at')
    search_fields = ('name', 'description', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
