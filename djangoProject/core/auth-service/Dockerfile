# Этап сборки
FROM golang:alpine AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o auth-service main.go

# Финальный образ
FROM alpine
WORKDIR /app
RUN apk add --no-cache openssl ca-certificates curl  # Добавляем openssl и curl для отладки
COPY --from=builder /build/auth-service .
CMD ["./auth-service"]