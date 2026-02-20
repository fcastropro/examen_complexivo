from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TableViewSet, OrderViewSet
from .service_types_views import service_types_list_create, service_types_detail
from .restaurant_services_views import restaurant_services_list_create, restaurant_services_detail
from .menus_views import menus_list_create, menus_detail
from .order_events_views import order_events_list_create, order_events_detail

router = DefaultRouter()
router.register(r"tables", TableViewSet, basename="tables")
router.register(r"orders", OrderViewSet, basename="orders")

urlpatterns = [
    path("service-types/", service_types_list_create),
    path("service-types/<str:id>/", service_types_detail),
    path("restaurant-services/", restaurant_services_list_create),
    path("restaurant-services/<str:id>/", restaurant_services_detail),
    path("menus/", menus_list_create),
    path("menus/<str:id>/", menus_detail),
    path("order-events/", order_events_list_create),
    path("order-events/<str:id>/", order_events_detail),
]

urlpatterns += router.urls
