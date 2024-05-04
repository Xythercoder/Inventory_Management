from django.db import models


# inventory table
class inventory(models.Model):

    Status = (("Pending", "Pending"), ("Approved", "Approved"))

    product_id = models.BigAutoField(primary_key=True, editable=False, unique=True)
    product_name = models.CharField(max_length=254)
    vendor = models.CharField(max_length=254)
    mrp = models.IntegerField()
    quantity = models.IntegerField()
    batch_no = models.CharField(max_length=254)
    batch_date = models.DateField(auto_now_add=True)
    status = models.CharField(choices=Status, max_length=50, default="Pending")

    def __str__(self):
        return self.product_name
