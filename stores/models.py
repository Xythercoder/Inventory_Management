from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils.timezone import now
import random
import string
from datetime import date

User = get_user_model()


class Inventory(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
    ]

    product_id = models.CharField(max_length=100, unique=True)
    product_name = models.CharField(max_length=255)
    vendor = models.CharField(max_length=255)
    mrp = models.DecimalField(max_digits=10, decimal_places=2, validators=[
                              MinValueValidator(0.01)])
    batch_num = models.CharField(max_length=100, unique=True)
    batch_date = models.DateField()
    quantity = models.PositiveIntegerField()
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='Pending'
    )  # Added status field
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='inventory_records')
    updated_by = models.ForeignKey(User, null=True, blank=True,
                                   on_delete=models.SET_NULL, related_name='inventory_updated')
    created_at = models.DateTimeField(default=now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product_name

    def generate_batch_num(self):
        # Define your custom format (for example: 'BATCH-YYYYMMDD-XXXX')
        today = date.today().strftime("%Y%m%d")
        random_number = ''.join(random.choices(
            string.digits, k=4))  # 4 random digits
        batch_num = f"batch-{today}-{random_number}"

        # Ensure that the batch_num is unique
        while Inventory.objects.filter(batch_num=batch_num).exists():
            random_number = ''.join(random.choices(string.digits, k=4))
            batch_num = f"batch-{today}-{random_number}"

        return batch_num

    def save(self, *args, **kwargs):
        if not self.batch_num:  # If batch_num is not already set
            self.batch_num = self.generate_batch_num()
        super().save(*args, **kwargs)

