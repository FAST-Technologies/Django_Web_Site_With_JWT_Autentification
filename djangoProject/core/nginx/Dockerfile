FROM nginx:latest

ENV TZ=Asia/Novosibirsk

# Удаляем стандартную конфигурацию
RUN rm /etc/nginx/conf.d/default.conf

# Копируем конфигурационные файлы
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Проверка работоспособности
HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -k -f https://localhost/ || exit 1