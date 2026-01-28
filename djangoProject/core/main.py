import os
from django.conf import settings
from django.core.management.utils import get_random_secret_key

def list_static_files():
    static_root = settings.STATIC_ROOT
    for root, _, files in os.walk(static_root):
        for file in files:
            print(os.path.join(root, file))

if __name__ == "__main__":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    import django
    django.setup()
    list_static_files()
    SECRET_KEY = os.environ.get('SECRET_KEY')
    print(get_random_secret_key())
    print(f"SECRET_KEY from environment: {SECRET_KEY}")