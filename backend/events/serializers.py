from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomUser, Event, Provider, Booking, Invitation, Review, Expense, Service, ServiceImage, Contact
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

# 🔹 Serializer Utilisateur
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        """model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'phone']"""
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'phone']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# 🔹 Serializer Événement
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id','name', 'date', 'location', 'guests', 'budget', #'organizer' 
                  ]

# 🔹 Serializer Prestataire
class ProviderSerializer(serializers.ModelSerializer):
    services = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )
    
    class Meta:
        model = Provider
        fields = '__all__'


# 🔹 Serializer Invitation
class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = '__all__'

# 🔹 Serializer Avis & Notations
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

# 🔹 Serializer Dépenses
class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'


class ProviderRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    entreprise = serializers.CharField(write_only=True)
    service = serializers.CharField(write_only=True)
    contact = serializers.CharField(write_only=True)
    description = serializers.CharField(write_only=True)
    

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'entreprise', 'service', 'contact', 'description']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='prestataire',
            is_provider=True
        )
        Provider.objects.create(
            user=user,
            entreprise=validated_data['entreprise'],
            service=validated_data['service'],
            contact=validated_data['contact'],
            description=validated_data['description']
        )
        return user
    
class ProviderLoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Vérifier si l'utilisateur est un prestataire
        if self.user.role != 'prestataire':
            raise serializers.ValidationError("Seuls les prestataires peuvent se connecter ici.")

        # Ajouter des informations supplémentaires dans le token
        data['username'] = self.user.username  # Ajouter le nom d'utilisateur dans le token
        return data

class ServiceImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ServiceImage
        fields = ['id', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

class ServiceSerializer(serializers.ModelSerializer):
    images = ServiceImageSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'is_available', 'created_at', 'updated_at', 'images']

    def create(self, validated_data):
        images_data = self.context.get('request').FILES
        service = Service.objects.create(**validated_data)
        for image_data in images_data.getlist('images'):
            ServiceImage.objects.create(service=service, image=image_data)
        return service

class ProviderProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Provider
        fields = ['username', 'email', 'entreprise', 'service', 'contact', 'description']


# 🔹 Serializer Réservation
# serializers.py
class BookingSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    event = EventSerializer(read_only=True)
    provider = ProviderSerializer(read_only=True)
    client = serializers.SerializerMethodField()
    # Pour la création
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(), 
        write_only=True,
        source='service'
    )
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all(),  # Suppression du filtre ici
        write_only=True,
        source='event'
    )

    class Meta:
        model = Booking
        fields = [
            'id', 'service', 'event', 'service','provider', 'status', 
            'booked_at', 'updated_at', 'client_notes', 'provider_notes',
            'service_id', 'event_id','client'
        ]
        read_only_fields = ['provider', 'booked_at', 'updated_at', 'status']
    def get_client(self, obj):
        return {
            'id': obj.event.organizer.id,
            'username': obj.event.organizer.username,
            'email': obj.event.organizer.email
        }

    def validate(self, data):
        # Vérifier que l'événement appartient bien à l'utilisateur
        request = self.context.get('request')
        if 'event' in data and data['event'].organizer != request.user:
            raise serializers.ValidationError("Vous ne pouvez réserver que pour vos propres événements.")
        
        # Vérifier que le service est disponible
        if 'service' in data and not data['service'].is_available:
            raise serializers.ValidationError("Ce service n'est plus disponible.")
        
        return data

    def create(self, validated_data):
        # Définir automatiquement le prestataire
        validated_data['provider'] = validated_data['service'].provider
        return super().create(validated_data)

class BookingStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['status', 'provider_notes']

# Dans serializers.py, ajoutez ceci sans modifier l'existant
class BookingDetailSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    event = EventSerializer(read_only=True)
    client = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = '__all__'

    def get_client(self, obj):
        return {
            'username': obj.event.organizer.username,
            'email': obj.event.organizer.email
        }
# Dans serializers.py
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at', 'is_read']