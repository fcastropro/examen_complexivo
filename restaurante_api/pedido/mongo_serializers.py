from rest_framework import serializers

class ServiceTypeSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    description = serializers.CharField(required=False, allow_blank=True)
    base_price = serializers.FloatField(required=False)
    is_active = serializers.BooleanField(default=True)

class RestaurantServiceSerializer(serializers.Serializer):
    table_id = serializers.IntegerField()
    menu_id = serializers.CharField(required=False)
    service_type_id = serializers.CharField(required=False)
    date = serializers.DateField(required=False)
    cost = serializers.FloatField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if not attrs.get("menu_id") and not attrs.get("service_type_id"):
            raise serializers.ValidationError("menu_id o service_type_id requerido")
        return attrs

class MenuSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    category = serializers.CharField(max_length=100, required=False, allow_blank=True)
    price = serializers.FloatField()
    is_available = serializers.BooleanField(default=True)

class OrderEventSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    event_type = serializers.ChoiceField(choices=["CREATED", "SENT_TO_KITCHEN", "SERVED", "PAID", "CANCELLED"])
    source = serializers.ChoiceField(choices=["WEB", "MOBILE", "SYSTEM"])
    note = serializers.CharField(required=False, allow_blank=True)
