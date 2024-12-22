from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Inventory
from .serializers import InventorySerializer
from .permissions import IsStoreManager, IsDepartmentManager
from rest_framework.permissions import IsAuthenticated

User = get_user_model()


class InventoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.user.roles.filter(name='Store Manager').exists():
            return [IsAuthenticated(), IsStoreManager()]
        elif self.request.user.roles.filter(name='Department Manager').exists():
            return [IsAuthenticated(), IsDepartmentManager()]
        return super().get_permissions()

    def get(self, request, pk=None):
        """
        Retrieve a single inventory item or a list of inventory items.
        - Query Parameters:
            * `status=pending`: Fetch all pending inventories.
            * `status=approved`: Fetch all approved inventories.
        """
        if pk:
            try:
                inventory_item = Inventory.objects.get(pk=pk)
                serializer = InventorySerializer(inventory_item)
                return Response(serializer.data)
            except Inventory.DoesNotExist:
                return Response({"detail": "Inventory item not found."}, status=404)

        # Check for `status` query parameter
        status = request.query_params.get('status', None)
        if status:
            if status.lower() == 'pending':
                inventory = Inventory.objects.filter(status="Pending")
            elif status.lower() == 'approved':
                inventory = Inventory.objects.filter(status="Approved")
            else:
                return Response(
                    {"detail": "Invalid status filter. Use 'pending' or 'approved'."},
                    status=400,
                )
        else:
            inventory = Inventory.objects.all()

        serializer = InventorySerializer(inventory, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Create a new inventory item.
        - Department Managers: Status set to "Pending".
        - Store Managers: Full CRUD permissions.
        """
        serializer = InventorySerializer(data=request.data)
        if serializer.is_valid():
            # Default status for Department Managers
            if request.user.roles.filter(name='Department Manager').exists():
                serializer.save(created_by=request.user, status="Pending")
            else:  # Store Managers
                serializer.save(created_by=request.user, status="Approved")
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        """
        Update an existing inventory item. Restricted for Department Managers without approval.
        Department Managers cannot update `status` after it is "Approved".
        """
        try:
            inventory_item = Inventory.objects.get(pk=pk)
            if (
                inventory_item.status == "Approved"
                and request.user.roles.filter(name='Department Manager').exists()
            ):
                return Response({"detail": "Cannot modify an approved inventory item."}, status=403)

            serializer = InventorySerializer(
                inventory_item, data=request.data, partial=False
            )
            if serializer.is_valid():
                serializer.save(updated_by=request.user)
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Inventory.DoesNotExist:
            return Response({"detail": "Inventory item not found."}, status=404)

    def patch(self, request, pk):
        """
        Partially update an existing inventory item. Restricted for Department Managers without approval.
        Department Managers cannot update `status` after it is "APPROVED".
        """
        try:
            inventory_item = Inventory.objects.get(pk=pk)
            if (
                inventory_item.status == "APPROVED"
                and request.user.roles.filter(name='Department Manager').exists()
            ):
                return Response({"detail": "Cannot modify an approved inventory item."}, status=403)

            serializer = InventorySerializer(
                inventory_item, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save(updated_by=request.user)
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Inventory.DoesNotExist:
            return Response({"detail": "Inventory item not found."}, status=404)

    def delete(self, request, pk):
        """
        Delete an inventory item. Restricted for Department Managers without approval.
        """
        if request.user.roles.filter(name='Department Manager').exists() and not request.user.crud_permission_granted:
            return Response({"detail": "Permission denied. CRUD access not granted."}, status=403)

        try:
            inventory_item = Inventory.objects.get(pk=pk)
            inventory_item.delete()
            return Response({"detail": "Item deleted."}, status=204)
        except Inventory.DoesNotExist:
            return Response({"detail": "Inventory item not found."}, status=404)


class ApproveInventoryAPIView(APIView):
    """
    Approve an inventory item. Only allowed for Store Managers.
    """
    permission_classes = [IsAuthenticated, IsStoreManager]

    def patch(self, request, pk):
        try:
            inventory_item = Inventory.objects.get(pk=pk)
            if inventory_item.status == "Approved":
                return Response({"detail": "Inventory item is already approved."}, status=400)

            inventory_item.status = "Aprroved"
            inventory_item.updated_by = request.user
            inventory_item.save()
            return Response({"detail": "Inventory item approved successfully."}, status=200)
        except Inventory.DoesNotExist:
            return Response({"detail": "Inventory item not found."}, status=404)


class InventoryCountView(APIView):
    """
    View to get the total count of inventory items.
    """
    permission_classes = [IsStoreManager | IsDepartmentManager]

    def get(self, request):
        total_count = Inventory.objects.all().count()
        return Response({"inventories_count": total_count})



class NotificationPendingView(APIView):
    
    permission_classes = [IsStoreManager | IsDepartmentManager]
    
    def get(self, request):
        pending = Inventory.objects.filter(status="Pending")
        serializer = InventorySerializer(pending, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class InventoryCountApprovedView(APIView):
    """
    View to get the total count of inventory items.
    """
    permission_classes = [IsStoreManager | IsDepartmentManager]

    def get(self, request):
        approved_count = Inventory.objects.filter(status="Approved").count()
        return Response({"approved_count": approved_count})


class InventoryCountPendingView(APIView):
    """
    View to get the total count of inventory items.
    """
    permission_classes = [IsStoreManager | IsDepartmentManager]

    def get(self, request):
        pending_count = Inventory.objects.filter(status="Pending").count()
        return Response({"pending_count": pending_count})


class NotificationApprovedView(APIView):

    permission_classes = [IsStoreManager | IsDepartmentManager]

    def get(self, request):
        approved = Inventory.objects.filter(status="Approved")
        serializer = InventorySerializer(approved, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
