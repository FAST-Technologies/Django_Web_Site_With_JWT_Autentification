from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .models import *
from django.http import JsonResponse, HttpResponse
from django.contrib import messages
from rest_framework.views import APIView
from django.contrib.auth import login as auth_login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.serializers import serialize
from .forms import RegistrationForm, AuthenticationForm
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.backends import ModelBackend
from .models import TeamMember, Task, Project
from .serializers import UserProfileSerializer
import json
import requests
import jwt
import uuid
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.conf import settings
from django.views.decorators.http import require_POST
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login as auth_login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

def home(request):
    return JsonResponse({"message": "Welcome to the app!"}, status=200)

def login_redirect(request, action="login"):
    state = str(uuid.uuid4())
    redirect_uri = request.build_absolute_uri(reverse('callback'))
    if action == "register":
        redirect_url = f"https://localhost:1321/sso/register?state={state}&redirect_uri={redirect_uri}"
    else:
        redirect_url = f"https://localhost:1321/sso/login?state={state}&redirect_uri={redirect_uri}"

    request.session['oauth_state'] = state
    print(f"Saving state in session: {state}, session_key: {request.session.session_key}")
    request.session.modified = True
    request.session.save()
    return redirect(redirect_url)

@csrf_exempt
def callback(request):
    if request.method == "GET":
        state = request.GET.get("state")
        tokens_json = request.GET.get("tokens")

        print(f"Callback URL Parameters - state: {state}, tokens: {tokens_json}")
        print(f"Expected state from session: {request.session.get('oauth_state')}")

        expected_state = request.session.get('oauth_state')
        if not tokens_json or not state or (expected_state and state != expected_state):
            if 'oauth_state' in request.session:
                del request.session['oauth_state']
            print(f"State mismatch: expected {expected_state}, got {state}")
            return JsonResponse({"error": "Invalid tokens or state mismatch"}, status=400)

        try:
            tokens = json.loads(tokens_json)
            access_token = tokens.get("AccessToken")
            refresh_token = tokens.get("RefreshToken")
            access_uuid = tokens.get("AccessUUID")
            refresh_uuid = tokens.get("RefreshUUID")
            at_expires = tokens.get("AtExpires")
            rt_expires = tokens.get("RtExpires")

            decoded_token = jwt.decode(access_token, options={"verify_signature": False})
            email = decoded_token.get("email", f"user_{uuid.uuid4()}@example.com")
            login_from_token = decoded_token.get("preferred_username", email.split("@")[0])
            token_user_id = decoded_token.get("user_id") or decoded_token.get("sub")

            user, created = User.objects.get_or_create(
                username=login_from_token,
                defaults={"email": email}
            )
            print(f"User created or fetched: {user.username}, user_id: {user.id}")

            profile, created = UserProfile.objects.get_or_create(user=user)
            if created or not profile.authdb_login:
                profile.authdb_login = login_from_token
                profile.authdb_id = token_user_id
                profile.save()

            auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            print(f"Saving UserProfile: authdb_login={profile.authdb_login}, authdb_id={profile.authdb_id}")

            request.session["access_token"] = access_token
            request.session["refresh_token"] = refresh_token
            request.session["access_uuid"] = access_uuid or f"access_{uuid.uuid4()}"
            request.session["refresh_uuid"] = refresh_uuid or f"refresh_{uuid.uuid4()}"
            request.session["at_expires"] = at_expires or 300
            request.session["rt_expires"] = rt_expires or 1800
            if 'oauth_state' in request.session:
                del request.session['oauth_state']

            request.session.modified = True
            request.session.save()

            return redirect("/dashboard/")
        except Exception as e:
            print(f"Error processing tokens: {e}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

def auth_callback_view(request):
    return redirect("/dashboard/")

def error_OK(request):
    return HttpResponse("Goodness")

def error_404(request, exception):
    return render(request, 'error_404.html', status=404)

def error_500(request):
    return render(request, 'error_500.html', status=500)

def login_page_new(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            request.session.modified = True
            request.session.save()
            print(f"User {user.username} logged in via form, session ID: {request.session.session_key}")
            return JsonResponse({
                'success': True,
                'redirect_url': '/dashboard/'
            })
        else:
            messages.error(request, "Неверный логин или пароль")
            print("Login failed via form: Invalid credentials")
            return render(request, "login_new.html", {'form': form})
    else:
        form = AuthenticationForm()
    return render(request, "login_new.html", {'form': form})

def register(request):
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({
                'success': True,
                'access_token': token.key,
                'redirect_url': '/dashboard/'
            })
        else:
            return render(request, "register_new.html", {'form': form})
    else:
        form = RegistrationForm()
    return render(request, "register_new.html", {'form': form})


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def dashboard_view(request):
    try:
        user_profile = request.user.profile
        username = user_profile.display_name if user_profile.display_name else user_profile.authdb_login or request.user.username
        profile_photo = user_profile.profile_photo.url if user_profile.profile_photo else f"{settings.STATIC_URL}images/account_image.png"
        print(f"Dashboard user: {request.user.username}, authdb_login: {user_profile.authdb_login}")
    except (AttributeError, UserProfile.DoesNotExist):
        username = request.user.username
        profile_photo = f"{settings.STATIC_URL}images/account_image.png"
        print(f"Dashboard user (no profile): {request.user.username}")

    tasks = Task.objects.all().select_related('project')
    tasks_data = [
        {
            "id": task.id,
            "project_id": task.project.id,
            "name": {"ru": task.name, "en": task.name},
            "description": {"ru": task.description, "en": task.description}
        }
        for task in tasks
    ]

    projects = Project.objects.all()
    projects_data = [
        {
            "id": project.id,
            "name": {"ru": project.name, "en": project.name},
            "description": {"ru": project.description, "en": project.description},
            "image": project.image.url if project.image else f"{settings.STATIC_URL}images/no_img.png"
        }
        for project in projects
    ]

    token_data = {
        "access_token": request.session.get("access_token", "No token"),
        "refresh_token": request.session.get("refresh_token", "No token"),
        "access_uuid": request.session.get("access_uuid", ""),
        "refresh_uuid": request.session.get("refresh_uuid", ""),
        "at_expires": request.session.get("at_expires", ""),
        "rt_expires": request.session.get("rt_expires", ""),
    }

    print(f"Token Data for {username}: {token_data}")

    context = {
        'username': username,
        'profile_photo': profile_photo,
        'is_authenticated': request.user.is_authenticated,
        'tasks_json': json.dumps(tasks_data),
        'projects': projects_data,
        'token_data': token_data,
    }
    return render(request, 'dashboard.html', context)

@login_required(login_url="/login/")
def profile_view(request):
    try:
        user_profile = request.user.profile
        username = user_profile.display_name if user_profile.display_name else request.user.first_name
        profile_photo = user_profile.profile_photo.url if user_profile.profile_photo else None
    except (AttributeError, UserProfile.DoesNotExist):
        username = request.user.first_name if request.user.is_authenticated else "Guest"
        profile_photo = None

    token_data = {
        "access_token": request.session.get("access_token", "No token"),
        "refresh_token": request.session.get("refresh_token", "No token"),
        "access_uuid": request.session.get("access_uuid", ""),
        "refresh_uuid": request.session.get("refresh_uuid", ""),
        "at_expires": request.session.get("at_expires", ""),
        "rt_expires": request.session.get("rt_expires", ""),
    }
    context = {
        'username': username,
        'profile_photo': profile_photo,
        'is_authenticated': request.user.is_authenticated,
        'token_data': token_data,
    }
    return render(request, 'profile.html', context)

class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        data = serializer.data
        profile_photo = data.get('profile_photo') if data.get('profile_photo') else f"{settings.STATIC_URL}images/account_image.png"
        print(f"Profile data for user {request.user.username}: {data}")
        return Response({
            'success': True,
            'username': data.get('username'),
            'display_name': data.get('display_name'),
            'profile_photo': profile_photo
        })

class UpdateProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            user_profile, created = UserProfile.objects.get_or_create(user=request.user)
            display_name = request.POST.get('username')
            profile_photo = request.FILES.get('photo')

            if display_name:
                user_profile.display_name = display_name
            if profile_photo:
                user_profile.profile_photo = profile_photo
            user_profile.save()

            request.session['username'] = display_name or user_profile.authdb_login
            request.session.modified = True

            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'redirect': '/dashboard/'
            })
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=400)

@csrf_exempt
@login_required(login_url="/login/")
def add_task(request):
    if request.method == 'POST':
        try:
            project_id = request.POST.get('project_id')
            name = request.POST.get('name')
            description = request.POST.get('description')

            if not project_id or not name or not description:
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

            project = get_object_or_404(Project, id=project_id)
            task = Task.objects.create(
                project=project,
                name=name,
                description=description
            )

            return JsonResponse({
                'success': True,
                'task_id': task.id
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

@login_required(login_url="/login/")
def project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    project_deleted = False

    if request.method == 'POST' and request.POST.get('action') == 'delete':
        try:
            project.delete()
            project_deleted = True
            # Проверяем, является ли запрос AJAX
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': True, 'redirect_url': '/dashboard/projects/'})
            return redirect("/dashboard/projects/")
        except Exception as e:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'error': str(e)}, status=500)
            messages.error(request, f"Ошибка при удалении проекта: {str(e)}")
            return render(request, 'project_detail.html', {
                'project': project,
                'project_deleted': project_deleted
            })

    return render(request, 'project_detail.html', {
        'project': project,
        'project_deleted': project_deleted
    })

@login_required(login_url="/login/")
def task_detail(request, task_id):
    task = get_object_or_404(Task, id=task_id)

    if request.method == 'POST':
        if request.content_type == 'application/json':
            try:
                data = json.loads(request.body)
                action = data.get('action')
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
        else:
            action = request.POST.get('action')

        if action == 'delete':
            try:
                task.delete()
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({'success': True, 'redirect_url': '/dashboard/tasks/'})
                return redirect("/dashboard/tasks/")
            except Exception as e:
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({'success': False, 'error': str(e)}, status=500)
                messages.error(request, f"Ошибка при удалении задачи: {str(e)}")
                return render(request, 'task_detail.html', {
                    'task_id': task_id,
                    'task': task,
                })
        return JsonResponse({'success': False, 'error': 'Invalid action'}, status=400)

    return render(request, 'task_detail.html', {
        'task_id': task_id,
        'task': task,
    })

class TaskListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        tasks = Task.objects.all().select_related('project')
        tasks_data = [
            {
                "id": task.id,
                "project_id": task.project.id,
                "name": {"ru": task.name, "en": task.name},
                "description": {"ru": task.description, "en": task.description}
            }
            for task in tasks
        ]
        return Response({"success": True, "tasks": tasks_data})


@csrf_exempt
@login_required(login_url="/login/")
def update_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)

    if request.method == 'POST':
        try:
            name = request.POST.get('name')
            description = request.POST.get('description')

            if name:
                task.name = name
            if description:
                task.description = description

            task.save()
            return JsonResponse({
                'success': True,
                'task_id': task.id
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

def team_view(request):
    try:
        user_profile = request.user.profile
        username = user_profile.display_name if user_profile.display_name else request.user.first_name
        profile_photo = user_profile.profile_photo.url if user_profile.profile_photo else f"{settings.STATIC_URL}images/account_image.png"
    except (AttributeError, UserProfile.DoesNotExist):
        username = request.user.first_name if request.user.is_authenticated else "Guest"
        profile_photo = f"{settings.STATIC_URL}images/account_image.png"
    team_members = TeamMember.objects.all()
    team_members_json = serialize('json', team_members)
    team_members_data = [
        {
            'image': (
                'images/' + member.get('fields', {}).get('image', 'images/no_member.jpg').split('/')[-1]
                if 'team_images' not in member.get('fields', {}).get('image', '')
                else 'team_images/' + member.get('fields', {}).get('image', 'team_images/no_member.jpg').split('/')[-1]
            ),
            'name': {
                'ru': member.get('fields', {}).get('name', 'Unnamed Member'),
                'en': member.get('fields', {}).get('name', 'Unnamed Member')
            },
            'description': {
                'ru': member.get('fields', {}).get('description', 'No description'),
                'en': member.get('fields', {}).get('description', 'No description')
            }
        }
        for member in json.loads(team_members_json)
    ]
    token_data = {
        "access_token": request.session.get("access_token", "No token"),
        "refresh_token": request.session.get("refresh_token", "No token"),
        "access_uuid": request.session.get("access_uuid", ""),
        "refresh_uuid": request.session.get("refresh_uuid", ""),
        "at_expires": request.session.get("at_expires", ""),
        "rt_expires": request.session.get("rt_expires", ""),
    }
    return render(request, 'Teams.html', {
        'team_members': team_members,
        'team_members_json': json.dumps(team_members_data, ensure_ascii=False),
        'username': username,
        'profile_photo': profile_photo,
        'is_authenticated': request.user.is_authenticated,
        'token_data': token_data,
    })

def Conditions(request):
    return render(request, 'Conditions.html')

def app_settings(request):
    return render(request, 'Settings.html')

def templates(request):
    return render(request, 'Templates.html')

def deleted(request):
    return render(request, 'deleted.html')

def projects(request):
    try:
        user_profile = request.user.profile
        username = user_profile.display_name if user_profile.display_name else request.user.first_name
        profile_photo = user_profile.profile_photo.url if user_profile.profile_photo else f"{settings.STATIC_URL}images/account_image.png"
    except (AttributeError, UserProfile.DoesNotExist):
        username = request.user.first_name if request.user.is_authenticated else "Guest"
        profile_photo = f"{settings.STATIC_URL}images/account_image.png"
    token_data = {
        "access_token": request.session.get("access_token", "No token"),
        "refresh_token": request.session.get("refresh_token", "No token"),
        "access_uuid": request.session.get("access_uuid", ""),
        "refresh_uuid": request.session.get("refresh_uuid", ""),
        "at_expires": request.session.get("at_expires", ""),
        "rt_expires": request.session.get("rt_expires", ""),
    }
    projects_list = Project.objects.all()
    projects_data = [
        {
            "id": project.id,
            "name": {"ru": project.name, "en": project.name},
            "description": {"ru": project.description, "en": project.description},
            "image": project.image.url if project.image else f"{settings.STATIC_URL}images/no_img.png"
        }
        for project in projects_list
    ]
    return render(request, 'Projects.html', {
        'username': username,
        'profile_photo': profile_photo,
        'is_authenticated': request.user.is_authenticated,
        'token_data': token_data,
        'projects': projects_data,  # Добавляем проекты в контекст
    })

def tasks(request):
    try:
        user_profile = request.user.profile
        username = user_profile.display_name if user_profile.display_name else request.user.first_name
        profile_photo = user_profile.profile_photo.url if user_profile.profile_photo else f"{settings.STATIC_URL}images/account_image.png"
    except (AttributeError, UserProfile.DoesNotExist):
        username = request.user.first_name if request.user.is_authenticated else "Guest"
        profile_photo = f"{settings.STATIC_URL}images/account_image.png"

    tasks = Task.objects.all().select_related('project')
    tasks_data = [
        {
            "id": task.id,
            "project_id": task.project.id,
            "name": {"ru": task.name, "en": task.name},
            "description": {"ru": task.description, "en": task.description}
        }
        for task in tasks
    ]

    projects = Project.objects.all()
    projects_data = [
        {
            "id": project.id,
            "name": {"ru": project.name, "en": project.name},
            "description": {"ru": project.description, "en": project.description},
            "image": project.image.url if project.image else f"{settings.STATIC_URL}images/no_img.png"
        }
        for project in projects
    ]

    token_data = {
        "access_token": request.session.get("access_token", "No token"),
        "refresh_token": request.session.get("refresh_token", "No token"),
        "access_uuid": request.session.get("access_uuid", ""),
        "refresh_uuid": request.session.get("refresh_uuid", ""),
        "at_expires": request.session.get("at_expires", ""),
        "rt_expires": request.session.get("rt_expires", ""),
    }

    return render(request, 'Tasks.html', {
        'username': username,
        'profile_photo': profile_photo,
        'is_authenticated': request.user.is_authenticated,
        'tasks': tasks,
        'tasks_json': json.dumps(tasks_data),
        'projects': projects_data,
        'token_data': token_data,
    })

def project_settings(request):
    return render(request, 'projectsSettings.html')

def workspaces(request):
    return render(request, 'Workspaces.html')

@csrf_exempt
@login_required(login_url="/login/")
def add_project(request):
    if request.method == 'POST':
        try:
            name = request.POST.get('name')
            description = request.POST.get('description')
            image = request.FILES.get('image')

            if not name or not description:
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

            # Создаём новый проект
            project = Project.objects.create(
                name=name,
                description=description,
                image=image
            )
            return JsonResponse({'success': True, 'project_id': project.id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

class ProjectListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            projects = Project.objects.all()
            projects_data = [
                {
                    "id": project.id,
                    "name": {"ru": project.name, "en": project.name},
                    "description": {"ru": project.description, "en": project.description},
                    "image": project.image.url if project.image else f"{settings.STATIC_URL}images/no_img.png"
                }
                for project in projects
            ]
            return Response({"success": True, "projects": projects_data})
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=500)

@csrf_exempt
@login_required(login_url="/login/")
def update_project(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    if request.method == 'POST':
        try:
            name = request.POST.get('name')
            description = request.POST.get('description')
            image = request.FILES.get('image')

            if name:
                project.name = name
            if description:
                project.description = description
            if image:
                project.image = image

            project.save()
            return JsonResponse({
                'success': True,
                'project_id': project.id,
                'image_url': project.image.url if project.image else None
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

def about(request):
    try:
        user_profile = request.user.profile
        username = user_profile.display_name if user_profile.display_name else request.user.first_name
        profile_photo = user_profile.profile_photo.url if user_profile.profile_photo else f"{settings.STATIC_URL}images/account_image.png"
    except (AttributeError, UserProfile.DoesNotExist):
        username = request.user.first_name if request.user.is_authenticated else "Guest"
        profile_photo = f"{settings.STATIC_URL}images/account_image.png"
    token_data = {
        "access_token": request.session.get("access_token", "No token"),
        "refresh_token": request.session.get("refresh_token", "No token"),
        "access_uuid": request.session.get("access_uuid", ""),
        "refresh_uuid": request.session.get("refresh_uuid", ""),
        "at_expires": request.session.get("at_expires", ""),
        "rt_expires": request.session.get("rt_expires", ""),
    }

    return render(request, 'AboutUs.html', {
        'username': username,
        'profile_photo': profile_photo,
        'is_authenticated': request.user.is_authenticated,
        'token_data': token_data,
    })

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(
            user=instance,
            display_name=f"User_{uuid.uuid4().hex[:8]}",
            profile_photo='images/account_image.png'
        )