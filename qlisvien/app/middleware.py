from django.shortcuts import redirect
from django.urls import reverse
from django.http import HttpResponseForbidden
from django.utils import timezone
from datetime import datetime, time

# Middleware xác thực người dùng
class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        protected_paths = ['/dashboard/', '/students/']
        public_paths = ['/', '/login/']
        # Nếu truy cập trang cần bảo vệ nhưng chưa login
        if request.path in protected_paths and not request.session.get('user_id'):
            return redirect('login')
        return self.get_response(request)

ALLOWED_PERIODS = [
    {
        'start': datetime(2025, 4, 26, 15, 0, tzinfo=timezone.get_current_timezone()),
        'end':   datetime(2025, 4, 26, 17, 0, tzinfo=timezone.get_current_timezone()),
    },
    {
        'start': datetime(2025, 4, 21, 14, 0, tzinfo=timezone.get_current_timezone()),
        'end':   datetime(2025, 4, 21, 18, 30, tzinfo=timezone.get_current_timezone()),
    },
]

class TimeRestrictionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        now = timezone.now().astimezone(timezone.get_fixed_timezone(7 * 60))
        path = request.path

        exempt_paths_periods = {
            '/author/': ALLOWED_PERIODS[0],
            '/dang_ky/': ALLOWED_PERIODS[1],
        }

        for paths, time in exempt_paths_periods.items():
            if path.startswith(paths):
                if not (time['start'] <= now <= time['end']):
                    s = time['start'].strftime('%d/%m/%Y %H:%M %Z (UTC%z)')
                    e = time['end'].strftime('%d/%m/%Y %H:%M %Z (UTC%z)')
                    n = now.strftime('%d/%m/%Y %H:%M %Z (UTC%z)')
                    return HttpResponseForbidden(
                        f"Thời gian hiện tại: {n}.\nThời gian hoạt động: {s} đến {e}."
                    )
                break
        return self.get_response(request)
