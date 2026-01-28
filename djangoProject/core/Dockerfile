FROM python:3.12-slim AS base
RUN mkdir /app
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Установи curl и зависимости
RUN apt-get update && apt-get install -y \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
# Добавляем python-multipart
RUN pip install --no-cache-dir fastapi uvicorn redis requests psycopg2-binary python-multipart
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

FROM base AS builder
RUN python manage.py collectstatic --noinput

FROM base AS development
EXPOSE 8000
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]

FROM base AS token
EXPOSE 8002
CMD ["python", "/app/token_validation.py"]

FROM python:3.12-slim AS production
RUN useradd -m -r appuser && \
    mkdir /app && \
    chown -R appuser /app
WORKDIR /app
RUN apt-get update && apt-get install -y \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/
COPY --from=builder /app/static /app/static
COPY --chown=appuser:appuser . .

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

USER appuser
EXPOSE 8000
CMD ["./entrypoint.sh"]