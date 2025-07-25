from django.contrib import admin
from .models import CustomUser, Event, Provider, Booking, Invitation, Review, Expense

admin.site.register(CustomUser)
admin.site.register(Event)
admin.site.register(Provider)
admin.site.register(Booking)
admin.site.register(Invitation)
admin.site.register(Review)
admin.site.register(Expense)

