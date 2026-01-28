#!/bin/bash

# Wait for the database to be ready (with a timeout)
echo "Waiting for database..."
timeout=30
count=0
while ! pg_isready -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME"; do
  sleep 1
  count=$((count + 1))
  if [ $count -ge $timeout ]; then
    echo "Error: Database is not ready after $timeout seconds. Exiting..."
    exit 1
  fi
done
echo "Database is ready!"

# Generate new migrations only if they don't exist or need updates
if [ ! -f "book/migrations/0001_initial.py" ]; then
    echo "Generating new migrations..."
    python manage.py makemigrations
else
    echo "Migrations already exist, checking for changes..."
    python manage.py makemigrations --check --dry-run || python manage.py makemigrations
fi

# Apply migrations without --fake-initial to ensure all changes are applied
echo "Applying migrations..."
python manage.py migrate --noinput

# Verify migration status
echo "Checking migrations status..."
python manage.py showmigrations

# Check if the book_userprofile table exists and has the authdb_login column
echo "Checking if book_userprofile table exists and has authdb_login..."
if ! PGPASSWORD="$DATABASE_PASSWORD" psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" -t -c "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'book_userprofile') AND EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'book_userprofile' AND column_name = 'authdb_login')" | grep -q t; then
    echo "book_userprofile table or authdb_login column does not exist. Applying migrations for 'book' app..."
    python manage.py migrate book --noinput
else
    echo "book_userprofile table and authdb_login column already exist."
fi

# Create superuser if it doesn’t exist
echo "Checking for superuser..."
if ! python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); exit(0 if User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists() else 1)"; then
    echo "Creating superuser: $DJANGO_SUPERUSER_USERNAME"
    echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser(username='$DJANGO_SUPERUSER_USERNAME', email='$DJANGO_SUPERUSER_EMAIL', password='$DJANGO_SUPERUSER_PASSWORD')" | python manage.py shell
else
    echo "Superuser $DJANGO_SUPERUSER_USERNAME already exists."
fi

# Seed the database (only in development)
if [ "$DEBUG" = "True" ]; then
    echo "Seeding database (development only)..."
    python manage.py seed_data
fi

# Collect static files (only in production)
if [ "$DEBUG" != "True" ]; then
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
fi

# Start the server
if [ "$DEBUG" = "True" ]; then
    echo "Starting development server..."
    exec python manage.py runserver 0.0.0.0:8000
else
    echo "Starting production server with Gunicorn..."
    exec gunicorn --bind 0.0.0.0:8000 --workers 3 core.wsgi:application
fi