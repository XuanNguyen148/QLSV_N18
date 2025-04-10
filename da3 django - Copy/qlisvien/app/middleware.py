from django.shortcuts import redirect
from django.urls import reverse

class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Các đường dẫn cần bảo vệ
        protected_paths = ['/dashboard/', '/students/']
        
        # Các đường dẫn công khai
        public_paths = ['/', '/login/']
        
        # Kiểm tra nếu người dùng truy cập vào protected paths
        if request.path in protected_paths:
            if not request.session.get('user_id'):
                return redirect('login')
                
        response = self.get_response(request)
        return response