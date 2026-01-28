# core/core/settings.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'placeholder')
DEBUG = bool(os.environ.get("DEBUG", default=0))
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "127.0.0.1").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",  # Добавлено для SITE_ID
    "book",
    'django_otp',
    'django_otp.plugins.otp_totp',
    'rest_framework',
    'rest_framework.authtoken',
    'social_django',
    'sass_processor',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.vk',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_otp.middleware.OTPMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'book.middleware.TokenMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',
        'book.auth_backends.CustomJWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'UNAUTHENTICATED_USER': None,
    'UNAUTHENTICATED_TOKEN': None,
    'EXCEPTION_HANDLER': 'rest_framework.views.exception_handler',
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DATABASE_NAME', 'dockerdjango'),
        'USER': os.getenv('DATABASE_USERNAME', 'dbuser'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD', 'dbpassword'),
        'HOST': os.getenv('DATABASE_HOST', 'db-dev'),
        'PORT': os.getenv('DATABASE_PORT', 5432),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
SITE_ID = 1  # Убедитесь, что соответствует записи в django_site

# Static files (CSS, JavaScript, Images)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
SASS_PROCESSOR_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentication settings
AUTHENTICATION_BACKENDS = (
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.vk.VKOAuth2',
)

# Add STATICFILES_FINDERS to enable SCSS compilation
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'sass_processor.finders.CssFinder',
]

# Ensure compiled CSS goes to static/css/
SASS_OUTPUT_DIR = 'css'
SASS_PROCESSOR_ENABLED = True

JWT_SECRET = os.getenv('JWT_SECRET', 'default_jwt_secret')

# Session settings
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_AGE = 1209600  # 2 недели
SESSION_COOKIE_SECURE = True  # Установите в True в продакшене с HTTPS
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'

# Security settings for production
SECURE_SSL_REDIRECT = True  # Установите в True в продакшене
SECURE_HSTS_SECONDS = 31536000  # Установите значение (например, 31536000) в продакшене
SECURE_HSTS_INCLUDE_SUBDOMAINS = True  # Установите в True в продакшене
SECURE_HSTS_PRELOAD = True  # Установите в True в продакшене
CSRF_COOKIE_SECURE = True  # Установите в True в продакшене
CSRF_COOKIE_HTTPONLY = True
SESSION_SAVE_EVERY_REQUEST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://localhost",
    "https://127.0.0.1",
]
CORS_ALLOW_CREDENTIALS = True

# Login/Logout redirects
LOGIN_REDIRECT_URL = '/dashboard/'
LOGOUT_REDIRECT_URL = '/login/'

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = ''
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = ''

SOCIAL_AUTH_VK_OAUTH2_KEY = ''
SOCIAL_AUTH_VK_OAUTH2_SECRET = ''
SOCIAL_AUTH_VK_OAUTH2_SCOPE = ['email']

LOGIN_REDIRECT_URL = '/dashboard/'
LOGOUT_REDIRECT_URL = '/login/'

SOCIAL_AUTH_URL_NAMESPACE = 'social'

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'

SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'social_core.pipeline.user.create_user',
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'social_core.pipeline.user.user_details',
)

SOCIAL_AUTH_GOOGLE_OAUTH2_AUTH_EXTRA_ARGUMENTS = {
    'access_type': 'online',
    'prompt': 'select_account',
}

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': '375007922907-ob68613rcqj3t44kg9irrcqspi3vmgmp.apps.googleusercontent.com',
            'secret': '',
            'key': ''
        },
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    },
    'vk': {
        'APP': {
            'client_id': '53524896',
            'secret': '',
            'key': ''
        },
        'SCOPE': ['email', 'profile'],
        'AUTH_PARAMS': {'v': '5.131'},
    }
}
# SOCIALACCOUNT_PROVIDERS['vk']['SCOPE'] = ['email']