from django.db import models
from django.contrib.auth.models import User

# Модель проекта
class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='images/', blank=True, null=True)

    def __str__(self):
        return self.name

# Модель задачи
class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    name = models.CharField(max_length=100)
    description = models.TextField()
    def __str__(self):
        return self.name

# Модель участника команды
class TeamMember(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='team_images/', null=True, blank=True)
    def __str__(self):
        return self.name

# Модель профиля пользователя
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=255, blank=True, null=True)
    profile_photo = models.ImageField(upload_to='images/', blank=True, null=True)
    authdb_login = models.CharField(max_length=255, blank=True, null=True)
    authdb_id = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s profile"