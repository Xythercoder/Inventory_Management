from django.urls import path
from .views import (
    InventoryListView,
    InventoryAddView,
    InventoryDetailView,
    InventoryPendingView,
    InventoryPendingCountView,
    InventoryApprovalView,
    InventoryCountView,
    InventoryAppoveCountView,
)

urlpatterns = [
    path(
        "InventoryLists", InventoryListView.as_view(), name="inventorylists"
    ),
    path(
        "InventoryListPending",
        InventoryPendingView.as_view(),
        name="inventorylistpending",
    ),
    path("InventoryAddCreate", InventoryAddView.as_view(), name="inventoryaddcreate"),
    path(
        "InventoryListPending",
        InventoryPendingView.as_view(),
        name="inventorylistpending",
    ),
    path(
        "Inventorycount",
        InventoryCountView.as_view(),
        name="inventorycount",
    ),
    path(
        "InventoryApproveCount",
        InventoryAppoveCountView.as_view(),
        name="inventoryapprovecount",
    ),
    path(
        "InventoryListPendingCount",
        InventoryPendingCountView.as_view(),
        name="inventorylistpendingcount",
    ),
    path(
        "InventoryRetrieveUpdateDelete/<int:pk>",
        InventoryDetailView.as_view(),
        name="retriveupdatedelete",
    ),
    path(
        "InventoryApprove/<int:pk>",
        InventoryApprovalView.as_view(),
        name="inventoryapprove",
    ),
]
