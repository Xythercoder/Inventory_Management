# inventorybd/utils.py
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """
    A custom exception handler to add additional data to the response.
    """
    # Get the standard error response from DRF
    response = exception_handler(exc, context)

    # If the response exists, modify it
    if response is not None:
        response.data['status'] = response.status_code
        response.data['error'] = str(exc)
    return response
