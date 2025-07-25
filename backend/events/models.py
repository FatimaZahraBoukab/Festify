from django.contrib.auth.models import AbstractUser
from django.db import models

# 🔹 1. Modèle Utilisateur
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('admin', 'Administrateur'),
        ('prestataire', 'Prestataire'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_provider = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text='Les groupes auxquels cet utilisateur appartient.'
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions',
        blank=True,
        help_text='Les permissions spécifiques de cet utilisateur.'
    )

    def __str__(self):
        return self.username

# 🔹 2. Modèle Événement
class Event(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateField()
    location = models.CharField(max_length=255)
    guests = models.IntegerField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    organizer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="events")
    created_at = models.DateTimeField(auto_now_add=True)

# 🔹 3. Modèle Prestataire
class Provider(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="provider")
    entreprise = models.CharField(max_length=255)
    service = models.CharField(max_length=255)
    contact = models.CharField(max_length=100)
    description = models.TextField()
    is_active = models.BooleanField(default=True)  # Ajout d'un champ pour le soft delete

    def __str__(self):
        return self.entreprise

# 🔹 5. Modèle Invitation
class Invitation(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="invitations")
    email = models.EmailField()
    status = models.CharField(max_length=20, choices=[
        ('sent', 'Envoyée'),
        ('accepted', 'Acceptée'),
        ('declined', 'Déclinée'),
    ], default='sent')
    sent_at = models.DateTimeField(auto_now_add=True)

# 🔹 6. Modèle Avis & Notations
class Review(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="reviews")
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name="reviews")
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

# 🔹 7. Modèle Dépenses
class Expense(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="expenses")
    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class Service(models.Model):
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name="services")
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ServiceImage(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to='service_images')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.service.name}"
    

# 🔹 4. Modèle Réservation
# models.py
class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmée'),
        ('cancelled', 'Annulée'),
        ('completed', 'Terminée'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="bookings")
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="bookings")
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name="bookings")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booked_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    client_notes = models.TextField(blank=True, null=True)
    provider_notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-booked_at']
        unique_together = ('event', 'service')  # Empêche les réservations en double

    def __str__(self):
        return f"Réservation #{self.id} - {self.service.name} pour {self.event.name}"

    def save(self, *args, **kwargs):
        # S'assurer que le provider est bien celui du service
        if self.service.provider != self.provider:
            self.provider = self.service.provider
        super().save(*args, **kwargs)

# Dans models.py, ajoutez ce modèle
class Contact(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)  # Pour marquer les messages lus/non lus

    def __str__(self):
        return f"{self.subject} - {self.name}"
# models.py
class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']