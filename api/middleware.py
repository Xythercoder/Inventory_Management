from django.utils.deprecation import MiddlewareMixin


class CsrfExemptMiddleware(MiddlewareMixin):
    """
    Middleware to exempt CSRF checks for API paths (e.g., starting with `/api/`).
    """

    def process_request(self, request):
        if request.path.startswith('/api/'):
            # Disable CSRF checks for API paths
            setattr(request, '_dont_enforce_csrf_checks', True)
