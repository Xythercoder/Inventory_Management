from rest_framework import serializers
from .models import inventory


class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        max_length=255, required=False, allow_null=True
    )
    vendor = serializers.CharField(max_length=255, required=False, allow_null=True)
    batch_no = serializers.CharField(max_length=255, required=False, allow_null=True)
    mrp = serializers.IntegerField(required=False, allow_null= True)
    quantity = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = inventory
        fields = [
            "product_id",
            "product_name",
            "vendor",
            "batch_no",
            "mrp",
            "quantity",
            "status",
        ]
