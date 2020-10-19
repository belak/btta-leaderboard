from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("api/", include("config.api_router")),
    path("auth-token/", obtain_auth_token),
    path("admin/", admin.site.urls),
] + static(settings.MEDIA_PATH, document_root=settings.MEDIA_ROOT)


# Unfortunately there isn't a great place to do this, so we do it here.
admin.site.disable_action('delete_selected')