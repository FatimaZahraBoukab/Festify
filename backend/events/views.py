from django.shortcuts import render
from rest_framework import viewsets, generics
from .models import CustomUser, Event, Notification, Provider, Booking, Invitation, Review, Expense, Service, ServiceImage, Contact
from .serializers import BookingStatusUpdateSerializer, CustomUserSerializer, EventSerializer, ProviderProfileSerializer, ProviderRegisterSerializer, ProviderSerializer, BookingSerializer, InvitationSerializer, ReviewSerializer, ExpenseSerializer, ProviderLoginSerializer, ServiceSerializer, ServiceImageSerializer, ContactSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status, generics
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.core.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token


# Dans views.py
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
import json

from events import serializers

@csrf_exempt
@api_view(['POST'])
def admin_login(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    
    # Authentification de l'utilisateur
    user = authenticate(username=username, password=password)
    
    if user is not None and user.is_staff:  # Vérifier que c'est bien un administrateur
        # Générer ou récupérer un token pour cet utilisateur
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'token': token.key,
            'user_id': user.id,
            'is_superuser': user.is_superuser
        })
    else:
        return Response({
            'success': False,
            'message': 'Identifiants invalides ou privilèges insuffisants.'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
# 🔹 Vue pour Utilisateurs
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

# 🔹 Vue pour Événements
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]  # 🔒 Protège l'accès avec JWT

    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user)  # 🔹 Récupère les événements de l'utilisateur connecté

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)  # 🔹 Associe l'événement à l'utilisateur

    def perform_destroy(self, instance):
        # Vérifiez que l'utilisateur est bien l'organisateur de l'événement
        if instance.organizer == self.request.user:
            instance.delete()
        else:
            raise PermissionDenied("Vous n'avez pas la permission de supprimer cet événement.")

# 🔹 Vue pour Prestataires
class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer
    permission_classes = [permissions.IsAuthenticated]  # 🔒 Protège l'accès

    def get_permissions(self):

        # Permettre l'accès à force_delete sans vérification d'admin pour le test
        if self.action == 'force_delete':
            return [permissions.IsAuthenticated()]

        if self.request.method in ['POST', 'PUT', 'DELETE']:  # 🔒 Seuls les admins peuvent modifier
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()
    
    # Ajout de la méthode pour le soft delete
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Au lieu de supprimer, marquer comme inactif
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    # Ajout d'une action personnalisée pour la suppression forcée
    @action(detail=True, methods=['delete'], url_path='force-delete')
    def force_delete(self, request, pk=None):
        try:
            instance = self.get_object()
            
            # Supprimer d'abord tous les services liés
            Service.objects.filter(provider=instance).delete()
            
            # Supprimer les réservations liées
            Booking.objects.filter(provider=instance).delete()
            
            # Supprimer les avis liés
            Review.objects.filter(provider=instance).delete()
            
            # Enfin, supprimer le prestataire
            instance.delete()
            
            return Response({"message": "Prestataire et toutes ses données associées supprimés avec succès"}, 
                           status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        service_name = self.request.query_params.get('service')
        if service_name:
            queryset = queryset.filter(service__icontains=service_name)
        return queryset
# views.py
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return BookingStatusUpdateSerializer
        return BookingSerializer

    def get_queryset(self):
        user = self.request.user
        
        # Pour les clients: voir leurs propres réservations
        if user.role == 'client':
            return Booking.objects.filter(event__organizer=user)
        
        # Pour les prestataires: voir les réservations de leurs services
        elif user.role == 'prestataire':
            return Booking.objects.filter(provider__user=user)
        
        # Pour les admins: voir toutes les réservations
        elif user.is_staff:
            return Booking.objects.all()
        
        return Booking.objects.none()

    def perform_create(self, serializer):
        # Vérifier que l'utilisateur est bien un client
        if self.request.user.role != 'client':
            raise PermissionDenied("Seuls les clients peuvent créer des réservations.")
        
        serializer.save()

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        booking = self.get_object()
        if booking.provider.user != request.user:
            raise PermissionDenied("Vous ne pouvez pas confirmer cette réservation.")
        
        booking.status = 'confirmed'
        booking.save()
        return Response({"status": "confirmed"})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        
        # Seul le client ou le prestataire peut annuler
        if booking.event.organizer != request.user and booking.provider.user != request.user:
            raise PermissionDenied("Vous ne pouvez pas annuler cette réservation.")
        
        booking.status = 'cancelled'
        booking.save()
        return Response({"status": "cancelled"})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        booking = self.get_object()
        if booking.provider.user != request.user:
            raise PermissionDenied("Seul le prestataire peut marquer une réservation comme terminée.")
        
        booking.status = 'completed'
        booking.save()
        return Response({"status": "completed"})
# 🔹 Vue pour Invitations
class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Invitation.objects.filter(event__organizer=self.request.user)  # 🔹 Afficher les invitations de l'utilisateur connecté

    def perform_create(self, serializer):
        invitation = serializer.save()
        
        # 📧 Envoi d'un email d'invitation (si SMTP est configuré)
        send_mail(
            subject=f"Invitation à {invitation.event.name}",
            message=f"Vous êtes invité à {invitation.event.name} le {invitation.event.date} à {invitation.event.location}. Veuillez répondre via l'application.",
            from_email="admin@monapp.com",
            recipient_list=[invitation.email],
            fail_silently=True,
        )

    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        invitation = self.get_object()
        status = request.data.get("status")

        if status in ["accepted", "declined"]:
            invitation.status = status
            invitation.save()
            return Response({"message": "Réponse enregistrée"})
        return Response({"error": "Statut invalide"}, status=400)

# 🔹 Vue pour Avis & Notations
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

# 🔹 Vue pour Dépenses
class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

User = get_user_model()

# 🔹 Inscription (Sign Up)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Compte créé avec succès"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Permet d'utiliser l'email au lieu de username si nécessaire"""
    def validate(self, attrs):
        if "email" in attrs:  # Si on utilise email pour se connecter
            try:
                user = User.objects.get(email=attrs["email"])
                attrs["username"] = user.username  # Convertir email en username
            except User.DoesNotExist:
                pass
        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email
        }
        return data

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    #permission_classes = [permissions.IsAdminUser]  # 🔒 Seuls les admins peuvent voir et gérer les utilisateurs
    permission_classes = [permissions.IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = CustomUserSerializer(request.user)
    return Response(serializer.data)

class ProviderRegisterView(generics.CreateAPIView):
    serializer_class = ProviderRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Prestataire enregistré avec succès"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProviderLoginView(TokenObtainPairView):
    serializer_class = ProviderLoginSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrage par provider_id si fourni dans les paramètres de requête
        provider_id = self.request.query_params.get('provider_id')
        if provider_id:
            queryset = queryset.filter(provider_id=provider_id)
        
        # Si l'utilisateur est un prestataire, ne retourner que ses services
        elif self.request.user.role == 'prestataire':
            queryset = queryset.filter(provider__user=self.request.user)
        
        # Inclure les images si le paramètre include_images est présent
        if self.request.query_params.get('include_images'):
            queryset = queryset.prefetch_related('images')
            
        return queryset

    @action(detail=True, methods=['get'])
    def images(self, request, pk=None):
       try:
            service = self.get_object()
            images = service.images.all()
            serializer = ServiceImageSerializer(images, many=True, context={'request': request})
            return Response(serializer.data)
       except Exception as e:
            return Response({"error": str(e)}, status=500)
    
    def perform_create(self, serializer):
        provider = Provider.objects.get(user=self.request.user)
        serializer.save(provider=provider)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.provider.user != request.user:
            return Response({"error": "Vous n'avez pas la permission de supprimer ce service."}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    
    
class ProviderProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProviderProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Récupérer le profil du prestataire connecté
        return self.request.user.provider

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data, status=status.HTTP_200_OK)
    


class ServiceImageViewSet(viewsets.ModelViewSet):
    queryset = ServiceImage.objects.all()
    serializer_class = ServiceImageSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all().order_by('-created_at')
    serializer_class = ContactSerializer

# views.py
def create_notification(user, message, booking=None):
    Notification.objects.create(user=user, message=message, booking=booking)

# Dans les actions de BookingViewSet
@action(detail=True, methods=['post'])
def confirm(self, request, pk=None):
    booking = self.get_object()
    booking.status = 'confirmed'
    booking.save()
    
    # Notification au client
    create_notification(
        user=booking.event.organizer,
        message=f"Votre réservation pour {booking.service.name} a été confirmée",
        booking=booking
    )
    
    return Response({"status": "confirmed"})