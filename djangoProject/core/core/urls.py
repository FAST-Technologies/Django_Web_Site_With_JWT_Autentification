"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django_otp.admin import OTPAdminSite
from rest_framework_simplejwt import views as jwt_views
from book import views

good = views.error_OK
handler404 = views.error_404
handler500 = views.error_500

urlpatterns = [
    path('', include('book.urls')),
    path("admin/", admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('social-auth/', include('social_django.urls', namespace='social')),
    path('api/token/',
         jwt_views.TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/token/refresh/',
         jwt_views.TokenRefreshView.as_view(),
         name='token_refresh'),
    path('api/profile/',
         views.ProfileView.as_view(),
         name='profile'),
    path('api/profile/update/',
         views.UpdateProfileView.as_view(),
         name='update_profile'),
]

# admin.site.__class__ = OTPAdminSite

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
