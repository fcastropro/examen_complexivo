from django.db import models

class Table(models.Model):
    name = models.CharField(max_length=50, unique=True)
    capacity = models.IntegerField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "PENDING"),
        ("IN_PROGRESS", "IN_PROGRESS"),
        ("SERVED", "SERVED"),
        ("PAID", "PAID"),
    ]
    table = models.ForeignKey(Table, on_delete=models.PROTECT, related_name="orders")
    items_summary = models.TextField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} Mesa {self.table.name}"
