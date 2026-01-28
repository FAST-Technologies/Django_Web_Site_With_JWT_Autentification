from django.urls import reverse
from django.shortcuts import redirect

class TokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        excluded_paths = ['/login/', '/register/', '/callback/']
        if any(request.path.startswith(path) for path in excluded_paths):
            print(f"Skipping TokenMiddleware for path: {request.path}")
            return self.get_response(request)

        if request.path.startswith('/dashboard/'):
            if not request.user.is_authenticated:
                print("User not authenticated for /dashboard/")
                return redirect(reverse('login'))
            print(f"User {request.user.username} is authenticated for /dashboard/")

        return self.get_response(request)