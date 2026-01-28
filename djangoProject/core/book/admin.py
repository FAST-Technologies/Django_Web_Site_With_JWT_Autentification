from django.contrib import admin
from book.models import *

admin.site.register(Project)
admin.site.register(Task)
admin.site.register(UserProfile)

