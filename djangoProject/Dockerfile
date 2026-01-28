# Use the official Python runtime image
FROM python:3.12-slim AS base
# Create the app directory
RUN mkdir /app

# Set the working directory inside the container
WORKDIR /app

# Set environment variables
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1

# Upgrade pip
RUN pip install --upgrade pip

# Copy the Django project  and install dependencies
COPY requirements.txt  .

# Install dependencies (with caching)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project to the container
COPY ./core .

FROM base AS builder
RUN python core/manage.py collectstatic --noinput

FROM base AS development
EXPOSE 8000

# Копирование entrypoint
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]

FROM python:3.12-slim AS production

RUN useradd -m -r appuser && \
   mkdir /app && \
   chown -R appuser /app

# Set the working directory
WORKDIR /app

# Copy the Python dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Copy application code
COPY --from=builder /app/static /app/static
COPY --chown=appuser:appuser . .

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Set environment variables to optimize Python
#ENV PYTHONDONTWRITEBYTECODE=1
#ENV PYTHONUNBUFFERED=1
#ENV DJANGO_SETTINGS_MODULE="core.settings"
#ENV APP_MODULE="core"
## Установка переменных окружения для разработки
#ENV DJANGO_SETTINGS_MODULE="core.settings"
#ENV APP_MODULE="core"
#ENV SECRET_KEY="placeholder"
#ENV DJANGO_SUPERUSER_USERNAME=admin
#ENV DJANGO_SUPERUSER_EMAIL=89137420014a@gmail.com
#ENV DJANGO_SUPERUSER_PASSWORD=admin

# Выполнение миграций (для разработки)

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 8000

#ENV DJANGO_SETTINGS_MODULE="core.settings"
#ENV APP_MODULE="core"
#ENV SECRET_KEY="placeholder"
#ENV DJANGO_SUPERUSER_USERNAME=admin
#ENV DJANGO_SUPERUSER_EMAIL=89137420014a@gmail.com
#ENV DJANGO_SUPERUSER_PASSWORD=admin

#RUN python manage.py makemigrations
#RUN python manage.py migrate
# Run migrations
#RUN python manage.py makemigrations
#RUN python manage.py migrate

# Start the application using Gunicorn
CMD ["./entrypoint.sh"]