from django.shortcuts import redirect
from django.http import HttpResponseForbidden
from django.utils import timezone
from . import models

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

 
class TimeRestrictionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        now = timezone.now().astimezone(timezone.get_fixed_timezone(7 * 60))
        path = request.path

        # Lấy thông tin lịch từ cơ sở dữ liệu
        path_to_malich = {
            '/ghi_danh/': models.TM.objects.get(loaidangky='ghi_danh').malich,  # Mã lịch cho ghi danh
            '/register/': models.TM.objects.get(loaidangky='dang_ky').malich,   # Mã lịch cho đăng ký
        }

        for path_prefix, malich in path_to_malich.items():
            if path.startswith(path_prefix):
                try:
                    lich = models.TM.objects.get(malich=malich)
                    if not (lich.batdau <= now <= lich.ketthuc):
                        s = lich.batdau.strftime('%d/%m/%Y %H:%M %Z (UTC%z)')
                        e = lich.ketthuc.strftime('%d/%m/%Y %H:%M %Z (UTC%z)')
                        n = now.strftime('%d/%m/%Y %H:%M %Z (UTC%z)')
                        return HttpResponseForbidden(
                            f"Thời gian hiện tại: {n}.\nThời gian hoạt động: {s} đến {e}."
                        )
                except models.TM.DoesNotExist:
                    # Nếu không tìm thấy lịch, có thể trả về lỗi hoặc cho phép truy cập
                    pass
                break
        return self.get_response(request)


