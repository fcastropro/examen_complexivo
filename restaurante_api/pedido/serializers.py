from rest_framework import serializers
from .models import Table, Order

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ["id", "name", "capacity", "is_available", "created_at"]

class OrderSerializer(serializers.ModelSerializer):
    table_name = serializers.CharField(source="table.name", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "table", "table_name", "items_summary", "total", "status", "created_at"]
