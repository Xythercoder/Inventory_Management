from django.urls import path
from .views import Register, UserListView, UserDetailView, UserApprovalView, UserUpdateView, UserDeleteView, CreateRoleView, RoleListView, GrantCRUDPermissionAPIView, UserCountView

urlpatterns = [
    # Added trailing slash for consistency
    path("register/", Register.as_view(), name="register"),
    path("role_create/", CreateRoleView.as_view(), name = "create_role"),
    path("role_list/", RoleListView.as_view(), name = "list-role"),
    path("list_user/", UserListView.as_view(),
         name="listuser"),  # Updated URL path
    path("total_user_count/", UserCountView.as_view(),
         name="total_count_user"),
    # Consistent naming and added trailing slash
    path("detail_user/<int:pk>/", UserDetailView.as_view(), name="detailuser"),
    path("approve_user/<int:pk>/", UserApprovalView.as_view(),
         name="approveuser"),  # Consistent naming and added trailing slash
    path("update_user_role/<int:pk>/",
         UserUpdateView.as_view(), name="update-user-role"),
    path("delete_user/<int:pk>/", UserDeleteView.as_view(), name="delete-user"),
    path('grant_crud/<int:department_manager_id>/',
         GrantCRUDPermissionAPIView.as_view(), name='grant-crud'),
]
