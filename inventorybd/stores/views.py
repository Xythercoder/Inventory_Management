from rest_framework import status
from django.http import Http404
from rest_framework.views import exception_handler
from rest_framework.response import Response
from .models import inventory
from .serializers import InventorySerializer
from rest_framework.views import APIView
from .permissions import (
    IsStoreManagerOrReadOnly,
    IsDepartmentManagerOrStoreManagerOrReadOnly,
)


class InventoryListView(APIView):
    permission_classes = [IsDepartmentManagerOrStoreManagerOrReadOnly]

    def get(self, request):
        store = inventory.objects.all()
        serializer = InventorySerializer(store, many=True)
        return Response(serializer.data)


class InventoryAddView(APIView):
    permission_classes = [IsDepartmentManagerOrStoreManagerOrReadOnly]

    def post(self, request):
        serializer = InventorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def custom_exception_handler(exc, context):
        response = exception_handler(exc, context)

        if response is not None:
            response.data = {
                'error': response.data
            }

        return response


class InventoryPendingView(APIView):
    permission_classes = [IsStoreManagerOrReadOnly]

    def get(self, request):
        pending_inventory = inventory.objects.filter(status__iexact="Pending")
        serializer = InventorySerializer(pending_inventory, many=True)
        return Response(serializer.data)


class InventoryCountView(APIView):
    permission_classes = [IsStoreManagerOrReadOnly]

    def get(self, request):
        pending_count = inventory.objects.all().count()
        return Response({"product_total_count": pending_count})


class InventoryPendingCountView(APIView):
    permission_classes = [IsStoreManagerOrReadOnly]

    def get(self, request):
        pending_count = inventory.objects.filter(status__iexact="Pending").count()
        return Response({"product_pending_count": pending_count})


class InventoryAppoveCountView(APIView):
    permission_classes = [IsStoreManagerOrReadOnly]

    def get(self, request):
        pending_count = inventory.objects.filter(status__iexact="Approved").count()
        return Response({"product_approve_count": pending_count})


class InventoryDetailView(APIView):
    permission_classes = [IsStoreManagerOrReadOnly]

    def get_object(self, pk):
        try:
            return inventory.objects.get(pk=pk)
        except inventory.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        store = self.get_object(pk)
        serializer = InventorySerializer(store)
        return Response(serializer.data)

    def put(self, request, pk):
        store = self.get_object(pk)
        serializer = InventorySerializer(store, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        store = self.get_object(pk)
        store.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class InventoryApprovalView(APIView):
    permission_classes = [IsStoreManagerOrReadOnly]

    def post(self, request, pk):
        try:
            self.store = inventory.objects.get(pk=pk)
        except self.store.DoesNotExist:
            return Response(
                {"message": "Inventory item does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.store.status = "Approved"
        self.store.save()
        return Response(
            {"message": "Inventory item approved successfully"},
            status=status.HTTP_200_OK,
        )
