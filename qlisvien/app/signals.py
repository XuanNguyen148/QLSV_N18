from django.contrib.auth.signals import user_login_failed
from django.dispatch import receiver

@receiver(user_login_failed)
def login_failed_handler(sender, credentials, request, **kwargs):
    print(f"[SIGNAL] Đăng nhập thất bại với tên đăng nhập: {credentials.get('username')}")
