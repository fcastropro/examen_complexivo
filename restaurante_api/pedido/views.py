from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Table, Order
from .serializers import TableSerializer, OrderSerializer
from .permissions import IsAdminOrReadOnly

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all().order_by("id")
    serializer_class = TableSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["id", "name", "capacity", "is_available", "created_at"]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related("table").all().order_by("-id")
    serializer_class = OrderSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["table", "status"]
    search_fields = ["items_summary", "table__name"]
    ordering_fields = ["id", "total", "status", "created_at"]

    def get_permissions(self):
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()
