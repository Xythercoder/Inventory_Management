from django.urls import path
from .views import InventoryAPIView, ApproveInventoryAPIView, InventoryCountView, InventoryCountPendingView, InventoryCountApprovedView, NotificationApprovedView, NotificationPendingView

urlpatterns = [
    path('inventory/', InventoryAPIView.as_view(), name='inventory_list_create'),
    path('inventory/<int:pk>/', InventoryAPIView.as_view(), name='inventory_detail'),
    path('total_inventory_count/', InventoryCountView.as_view(),
         name='inventory_count'),
    path('pending_inventory_count/', InventoryCountPendingView.as_view(),
         name='inventory_pending_count'),
    path('approved_inventory_count/', InventoryCountApprovedView.as_view(),
         name='inventory_approved_count'),
    path('approved_inventory/<int:pk>/', ApproveInventoryAPIView.as_view(),
         name='inventory_approved'),
    path('approved_notification/', NotificationApprovedView.as_view(),
         name='notification_approved'),
    path('pending_notification/', NotificationPendingView.as_view(),
         name='notification_pending'),
]
