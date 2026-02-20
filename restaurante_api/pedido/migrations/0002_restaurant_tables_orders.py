import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pedido", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="vehiculo",
            name="marca",
        ),
        migrations.DeleteModel(
            name="Vehiculo",
        ),
        migrations.DeleteModel(
            name="Marca",
        ),
        migrations.CreateModel(
            name="Table",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=50, unique=True)),
                ("capacity", models.IntegerField()),
                ("is_available", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("items_summary", models.TextField()),
                ("total", models.DecimalField(decimal_places=2, max_digits=10)),
                ("status", models.CharField(choices=[("PENDING", "PENDING"), ("IN_PROGRESS", "IN_PROGRESS"), ("SERVED", "SERVED"), ("PAID", "PAID")], max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("table", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="orders", to="pedido.table")),
            ],
        ),
    ]
