from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, HttpResponse
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('login/', login_page_new, name="login"),
    path('register/', register, name="register"),
    path('dashboard/', dashboard_view, name="dashboard"),
    path('dashboard/Conditions', Conditions, name="Conditions"),
    path('dashboard/projects/<int:project_id>/', project_detail, name="project_detail"),
    path('api/projects/<int:project_id>/update/', update_project, name='update_project'),
    path('dashboard/settings/', app_settings, name='Settings'),
    path('dashboard/templates/', templates, name='Templates'),
    path('dashboard/deleted/', deleted, name='deleted'),
    path('dashboard/projects/', projects, name='Projects'),
    path('dashboard/tasks/', tasks, name='Tasks'),
    path('dashboard/tasks/<int:task_id>/', task_detail, name="task_detail"),
    path('api/tasks/<int:task_id>/update/', update_task, name='update_task'),
    path('dashboard/tasks/add/', add_task, name='add_task'),
    path('dashboard/project-settings/', project_settings, name='projectsSettings'),
    path('dashboard/workspaces/', workspaces, name='Workspaces'),
    path('dashboard/teams/', team_view, name='Teams'),
    path('dashboard/about/', about, name='AboutUs'),
    path('dashboard/profile/', profile_view, name='profile'),
    path('api/profile/update/', UpdateProfileView.as_view(), name='update_profile'),
    path('api/tasks/', TaskListView.as_view(), name='task_list'),
    path('api/projects/', ProjectListView.as_view(), name='project_list'),
    path('api/projects/add/', add_project, name='add_project'),
    path('callback/', callback, name='callback'),
    path('auth-callback/', auth_callback_view, name='auth-callback'),
    path('login-redirect/', login_redirect, name='login_redirect'),
    path('favicon.ico', lambda request: HttpResponse(status=204)),
]



