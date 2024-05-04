from django.urls import path
from .views import Register, UserListView, UserDetailView, UserApprovalView

urlpatterns = [
    path("register", Register.as_view(), name="register"),
    path("ListUser", UserListView.as_view(), name="listuser"),
    path("DetailUser/<int:pk>", UserDetailView.as_view(), name="Detail"),
    path("ApproveUser/<int:pk>", UserApprovalView.as_view(), name="Approve"),
]
