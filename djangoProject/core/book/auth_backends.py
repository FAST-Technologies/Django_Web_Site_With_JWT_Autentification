import jwt
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import authentication, exceptions
from .models import UserProfile

User = get_user_model()

class CustomJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        print("Checking JWT authenticate works")
        if not auth_header:
            return None

        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            raise exceptions.AuthenticationFailed('Invalid token header')

        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
            authdb_user_id = payload.get('user_id')
            if not authdb_user_id:
                raise exceptions.AuthenticationFailed('Invalid token payload')

            user_profile = UserProfile.objects.filter(authdb_id=authdb_user_id).first()
            if not user_profile:
                raise exceptions.AuthenticationFailed('User not found in Django')

            user = user_profile.user
            if not user.is_active:
                raise exceptions.AuthenticationFailed('User inactive')

            return (user, token)
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')

    def authenticate_header(self, request):
        return 'Bearer'