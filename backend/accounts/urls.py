# accounts/urls.py
from django.urls import path
from .views import RegisterView, LoginView, VerifyTokenView

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/verify-token/", VerifyTokenView.as_view(), name="auth-verify"),
]
