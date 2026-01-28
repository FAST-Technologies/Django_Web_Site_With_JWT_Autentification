#!/bin/bash

# Apply database migrations
echo "Applying database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser if it doesn’t exist
echo "Checking for superuser..."
echo "DJANGO_SUPERUSER_USERNAME is: '$DJANGO_SUPERUSER_USERNAME'"  # Debug output
if ! python core/manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); exit(0 if User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists() else 1)"; then
    echo "Creating superuser: $DJANGO_SUPERUSER_USERNAME"
    python core/manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_superuser(username='$DJANGO_SUPERUSER_USERNAME', email='$DJANGO_SUPERUSER_EMAIL', password='$DJANGO_SUPERUSER_PASSWORD')
EOF
else
    echo "Superuser $DJANGO_SUPERUSER_USERNAME already exists."
fi

# Start Gunicorn
echo "Starting Gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 --workers 3 core.wsgi:application

## Create superuser if not exists
#if ! python manage.py createsuperuser --username="$DJANGO_SUPERUSER_USERNAME" --email="$DJANGO_SUPERUSER_EMAIL" --noinput > /dev/null 2>&1; then
#  echo "Creating superuser..."
#  echo "$DJANGO_SUPERUSER_USERNAME" | python manage.py createsuperuser --username="$DJANGO_SUPERUSER_USERNAME" --email="$DJANGO_SUPERUSER_EMAIL" --noinput
#  echo "$DJANGO_SUPERUSER_PASSWORD" | python manage.py createsuperuser --username="$DJANGO_SUPERUSER_USERNAME" --email="$DJANGO_SUPERUSER_EMAIL" --noinput
#fi
