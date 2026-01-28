# Краткое описание

Веб приложение - технология-замена Redmine. Приложение представляет из себя систему управления проектами, основанную на Redmine и Trello.

# Переменные окружения

Для дальнейшей корректной работы приложения создайте файл `.env` в корневой папке проекта и поместите туда следующие переменные окружения:

```
  # Префикс запускаемого контейнера, образа и сети в Docker
  CONTAINER_PREFIX=myapp

  # Порт, на котором будет запущенно STREAMLIT приложение
  CONTAINER_DEV_STREAMLIT_PORT=8501
  CONTAINER_PROD_STREAMLIT_PORT=8501

  # Номер порта host-машины, на который будет идти трафик из контейнера для режима разработки
  CONTAINER_DEV_PORT=1319

  # Номер порта host-машины, на который будет идти трафик из контейнера для режима prod
  CONTAINER_PROD_PORT=1318
  
  # Информация, необходимая для работы Django-приложения

  # Некоторый секретный ключ
  DJANGO_SECRET_KEY="nt#_hd%*q2!=@c_i%0p6do01l#p8^x3iz5&js*%nm@q!6cyu5="
  
  # Логин для Django-admin
  DJANGO_SUPERUSER_USERNAME=admin
  
  # Почта для Django-admin
  DJANGO_SUPERUSER_EMAIL=...@gmail.com
  
  # Пароль для Django-admin
  DJANGO_SUPERUSER_PASSWORD=admin
```

# Инструкция по развёртыванию с Docker

- Запустите Docker или установите с [официального сайта](https://www.docker.com/products/docker-desktop/)

### Запуск в режиме разработки

- Перед началом развёртывания:
- Перейдите в директорию core:

  ```
  cd core
  ```
- Настройте виртуальную среду разработки Python следующими командами:
  ```
  python -m venv .venv
  .venv\Scripts\activate
  ```
- Обновите pip и подтяните зависимости

  ```
  pip install --upgrade pip
  pip install --no-cache-dir -r requirements.txt
  ```

- Выполните следующую команду в коревой директории проекта:

  ```
  docker-compose --profile dev up --build
  ```
  
- Для остановки и удаления контейнеров запустить следующую команду:

  ```
  docker-compose --profile dev down
  ```
  
- Для просмотра конфигураций введите команду:
  ```
  docker-compose --profile dev config
  ```

- После успешного запуска контейнера перейдите по адресу `http://localhost:1319/` для просмотра клиентской части (порт в адресе указывается в соответствии с переменной окружения `CONTAINER_DEV_PORT`)

### Запуск в режиме prod-сборки

- Выполните следующую команду в коревой директории проекта:

  ```
  docker-compose --profile prod up --build
  ```

- Для остановки и удаления контейнеров запустить следующую команду:

  ```
  docker-compose --profile prod down
  ```
  
- Для просмотра конфигураций введите команду:
  ```
  docker-compose --profile prod config
  ```

- После успешного запуска контейнера перейдите по адресу `http://localhost:1318/` для просмотра клиентской части (порт в адресе указывается в соответствии с переменной окружения `CONTAINER_PROD_PORT`)

- Если необходимо установка системной переменной:
  ```
  $env:DJANGO_SECRET_KEY = "nt#_hd%*q2!=@c_i%0p6do01l#p8^x3iz5&js*%nm@q!6cyu5="
  ```
- Для полного удаления информации  о контейнерах, ввести команду:
  ```
  docker system prune
  ```
  
### Общая структура проекта

# Для Prod:
  ```
  localhost:1318 - основной сайт
  http://localhost:1318/register/ - регистрация
  http://localhost:1318/login/ - вход
  http://localhost:1318/admin/ - переход в Django Administration
  http://localhost:1318/hello/ - страница-вариант работы Django REST Framework
  ``` 

# Для Dev:
  ```
  localhost:1319 - основной сайт
  http://localhost:1319/register/ - регистрация
  http://localhost:1319/login/ - вход
  http://localhost:1319/admin/ - переход в Django Administration
  http://localhost:1318/hello/ - страница-вариант работы Django REST Framework
  ``` 

# Дополнительная информация

### Если тебе потребуется работать с SCSS на Django, используй для стилей следующую технологию:

```
sass static/scss/relife_dashboard.scss static/css/relife_dashboard.css
python manage.py collectstatic
```

Данный способ позволит тебе собрать статические стили в папку, и при компиляции с Докером эти стили будут автоматически подгружаться

### Миграции для Book могут не работать, необходимо пока поступать следующим образом:

```
python manage.py makemigrations book
python manage.py migrate book
```


