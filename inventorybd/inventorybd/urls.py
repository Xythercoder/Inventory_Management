from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from users.views import CustomTokenObtainPairView


urlpatterns = [
    path("api-auth", include("rest_framework.urls")),
    path("api/token", CustomTokenObtainPairView.as_view(), name="token_obtain"),
    path("api/users/", include("users.urls")),
    path("api/stores/", include("stores.urls")),
    path("admin/", admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [re_path(r"^.*", TemplateView.as_view(template_name="index.html"))]
