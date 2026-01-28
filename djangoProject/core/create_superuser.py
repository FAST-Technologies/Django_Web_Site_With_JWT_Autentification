import os
import django
from django.contrib.auth.models import User

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

if not User.objects.filter(username=os.environ.get('DJANGO_SUPERUSER_USERNAME', 'Vladimir')).exists():
    User.objects.create_superuser(
        os.environ.get('DJANGO_SUPERUSER_USERNAME', 'Vladimir'),
        os.environ.get('DJANGO_SUPERUSER_EMAIL', '89137420014a@gmail.com'),
        os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'FAST1987!')
    )