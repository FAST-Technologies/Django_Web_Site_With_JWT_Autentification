from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    profile_photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'profile_photo']

    def get_profile_photo(self, obj):
        try:
            return obj.profile.profile_photo.url if obj.profile.profile_photo else None
        except (AttributeError, UserProfile.DoesNotExist):
            return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            user_profile = instance.profile
            representation['display_name'] = user_profile.display_name if user_profile.display_name else instance.first_name
        except (AttributeError, UserProfile.DoesNotExist):
            representation['display_name'] = instance.first_name
        return representation