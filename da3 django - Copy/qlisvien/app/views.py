from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, logout
from .models import CustomUser
from .models import Student

# Create your views here.
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
    all_users = CustomUser.objects.all()
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        # Lưu thông tin POST để debug
        debug_info['post_data'] = {
            'username': username,
            'password': password
        }
        
        try:
            user = CustomUser.objects.get(username=username, password=password)
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
            
        except CustomUser.DoesNotExist:
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

def student_list(request):
    # Kiểm tra session
    if not request.session.get('user_id'):
        return redirect('login')
        
    students = Student.objects.all()
    context = {
        'username': request.session.get('username'),
        'students': students
    }
    return render(request, 'pages/student_list.html', context)