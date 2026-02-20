from django.contrib import admin
from .models import Table, Order

@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "capacity", "is_available", "created_at"]

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "table", "items_summary", "total", "status", "created_at"]
    list_filter = ["status"]
