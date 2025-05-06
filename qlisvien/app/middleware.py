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
            '/ghi_danh/': None,
            '/register/': None,
        }

        # Lấy dữ liệu từ cơ sở dữ liệu một cách an toàn
        ghi_danh_timing = models.TM.objects.filter(loaidangky='ghi_danh').first()
        if ghi_danh_timing:
            path_to_malich['/ghi_danh/'] = ghi_danh_timing.malich

        dang_ky_timing = models.TM.objects.filter(loaidangky='dang_ky').first()
        if dang_ky_timing:
            path_to_malich['/register/'] = dang_ky_timing.malich

        for path_prefix, malich in path_to_malich.items():
            if path.startswith(path_prefix):
                if malich is None:
                    # Nếu không có lịch, cho phép truy cập hoặc xử lý theo logic mong muốn
                    break
                try:
                    lich = models.TM.objects.get(malich=malich)
                    if not (lich.batdau <= now <= lich.ketthuc):
                        s = lich.batdau.astimezone(timezone.get_fixed_timezone(7 * 60)).strftime('%d/%m/%Y %H:%M (UTC%z)')
                        e = lich.ketthuc.astimezone(timezone.get_fixed_timezone(7 * 60)).strftime('%d/%m/%Y %H:%M (UTC%z)')
                        n = now.strftime('%d/%m/%Y %H:%M (UTC%z)')
                        return HttpResponseForbidden(
                            f"Thời gian hiện tại: {n}.\nThời gian hoạt động: {s} đến {e}."
                        )
                except models.TM.DoesNotExist:
                    # Nếu không tìm thấy lịch, có thể trả về lỗi hoặc cho phép truy cập
                    break
                break
        return self.get_response(request)


