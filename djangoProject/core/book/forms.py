from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True, label="Login")
    name = forms.CharField(max_length=100, required=True, label="Name", help_text="Enter your name")

    class Meta:
        model = User
        fields = ('email', 'name', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].widget.attrs.update({'placeholder': 'Login'})
        self.fields['name'].widget.attrs.update({'placeholder': 'Type your name'})
        self.fields['password1'].widget.attrs.update({'placeholder': 'Password'})
        self.fields['password2'].widget.attrs.update({'placeholder': 'Confirm Password'})
        self.fields['password1'].label = "Password"
        self.fields['password2'].label = "Confirm Password"

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email is already registered.")
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.username = self.cleaned_data['email']
        user.first_name = self.cleaned_data['name']
        if commit:
            user.save()
        return user

class AuthenticationForm(AuthenticationForm):
    username = forms.EmailField(label="Login")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'placeholder': 'Login'})
        self.fields['password'].widget.attrs.update({'placeholder': 'Password'})
        self.fields['username'].label = "Login"
        self.fields['password'].label = "Password"