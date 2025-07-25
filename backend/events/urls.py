from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from . import views
from .views import (
    CustomUserViewSet, EventViewSet, ProviderProfileView, ProviderRegisterView, ProviderViewSet, 
    BookingViewSet, InvitationViewSet, ReviewViewSet, ExpenseViewSet, RegisterView, LoginView, ServiceViewSet, UserViewSet, current_user, ProviderLoginView, ContactViewSet
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



# 🔹 Créer un routeur DRF pour générer les routes automatiquement
router = DefaultRouter()
#router.register(r'users', CustomUserViewSet)
router.register(r'users', UserViewSet)  # Gérer les utilisateurs
router.register(r'events', EventViewSet)
router.register(r'providers', ProviderViewSet)
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'invitations', InvitationViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'contacts', ContactViewSet)

# 🔹 Lier les routes API au fichier `urls.py`
urlpatterns = [
    path('api/', include(router.urls)),  # Toutes les routes API
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    #path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/me/', current_user, name='current_user'),
    path('api/register/provider/', ProviderRegisterView.as_view(), name='provider_register'),
    path('api/login/provider/', ProviderLoginView.as_view(), name='provider_login'),
    path('api/provider/profile/', ProviderProfileView.as_view(), name='provider-profile'),
    path('api/admin/login/', views.admin_login, name='admin_login'),

    path('api/admin/login/', views.admin_login, name='admin_login'),
    # Correction de l'URL pour la suppression forcée - sans duplication du préfixe "api/"
    path('providers/<int:pk>/force-delete/', ProviderViewSet.as_view({'delete': 'force_delete'}), name='provider-force-delete'),


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
