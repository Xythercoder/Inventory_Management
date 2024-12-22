from rest_framework import serializers
from .models import Inventory

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'
        read_only_fields = ['id', 'batch_num', 'created_by', 'updated_by', 'created_at', 'updated_at']

    def validate_mrp(self, value):
        if value <= 0:
            raise serializers.ValidationError("MRP must be a positive number.")
        return value

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        return value

    def validate_batch_date(self, value):
        from datetime import date
        if value > date.today():
            raise serializers.ValidationError(
                "Batch date cannot be in the future.")
        return value
