from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, logout
from . import models

# Create your views here.
def ghi_danh(request):
    kqghidanh = models.KQGhidanh.objects.select_related('mahp', 'masv').all()  # Lấy dữ liệu từ bảng liên quan
    hpghidanh = models.HPGhiDanh.objects.select_related('mahp').all()  # Lấy dữ liệu từ bảng liên quan
    context = {
        'hpghidanh': hpghidanh,
        'kqghidanh': kqghidanh
    }

    return render(request, 'pages/ghi_danh.html', context)

def index(request):
    return render(request, 'pages/login.html')
    # response = HttpResponse()
    # response.write('<h1>Welcome to Qlisvien</h1>')
    # response.write('<p>This is the index page.</p>')
    # return response

def dashboard(request):
    # Kiểm tra session
    if not request.session.get('user_id'):
        return redirect('login')
        
    context = {
        'username': request.session.get('username'),
        'show_notification': request.session.get('show_welcome', False)
    }
    
    if 'show_welcome' in request.session:
        del request.session['show_welcome']
        
    return render(request, 'pages/dashboard.html', context)

def login_view(request):
    # Khởi tạo debug info
    debug_info = {
        'post_data': None,
        'found_users': None,
        'last_query': None
    }
    
    # Lấy danh sách users
    all_users = models.CustomUser.objects.all()
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        # Lưu thông tin POST để debug
        debug_info['post_data'] = {
            'username': username,
            'password': password
        }
        
        try:
            user = models.CustomUser.objects.get(username=username, password=password)
            # Lưu kết quả truy vấn để debug
            debug_info['found_users'] = [{
                'id': user.id,
                'username': user.username
            }]
            
            # Lưu session và chuyển hướng
            request.session['user_id'] = user.id
            request.session['username'] = user.username
            request.session['show_welcome'] = True
            
            return redirect('dashboard')
            
        except models.CustomUser.DoesNotExist:
            debug_info['last_query'] = "Không tìm thấy tài khoản"
            messages.error(request, 'Tài khoản hoặc mật khẩu không chính xác')
        except Exception as e:
            debug_info['last_query'] = str(e)
            messages.error(request, f'Lỗi: {str(e)}')
    
    context = {
        'all_users': all_users,
        'debug_info': debug_info,
        'debug': True  # Bật chế độ debug
    }
    
    return render(request, 'pages/login.html', context)

def logout_view(request):
    # Xóa thông tin session
    request.session.flush()
    return redirect('login')

def change_password(request):
    if not request.session.get('user_id'):
        return redirect('login')
        
    if request.method == 'POST':
        current_password = request.POST.get('current_password')
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')
        
        try:
            # Kiểm tra mật khẩu hiện tại
            user = models.CustomUser.objects.get(
                id=request.session.get('user_id'),
                password=current_password
            )
            
            # Kiểm tra mật khẩu mới và xác nhận
            if new_password != confirm_password:
                messages.error(request, 'Mật khẩu mới và xác nhận mật khẩu không khớp')
                return redirect('change_password')
            
            # Cập nhật mật khẩu mới
            user.password = new_password
            user.save()
            
            messages.success(request, 'Đổi mật khẩu thành công')
            
        except models.CustomUser.DoesNotExist:
            messages.error(request, 'Mật khẩu hiện tại không đúng')
        except Exception as e:
            messages.error(request, f'Có lỗi xảy ra: {str(e)}')
    
    return render(request, 'pages/change_password.html')

def forgot_password(request):
    if request.method == 'POST':
        # handle gửi email
        pass
    return render(request, 'pages/forgot_password.html')

def qlihp(request):
    return render(request, 'pages/qlihp.html')

###
def history(request):
    if not request.session.get('user_id'):
        return redirect('login')
        
    # Thêm print để debug
    kqghidanh = models.KQGhidanh.objects.select_related('mahp', 'masv').all()
    print(f"Số lượng bản ghi: {kqghidanh.count()}")
    
    context = {
        'username': request.session.get('username'),
        'kqghidanh': kqghidanh
    }
    
    return render(request, 'pages/history.html', context)

def register(request):
    # Xử lý logic cho trang Đăng ký học phần (nếu cần)
    return render(request, 'pages/register.html')

def timing(request):
    # Xử lý logic cho trang Hẹn giờ đăng ký (nếu cần)
    return render(request, 'pages/timing.html')

def author(request):
    return render(request, 'pages/author.html')