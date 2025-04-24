from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, logout
from django.http import JsonResponse
from . import models
from django.views.decorators.http import require_http_methods
from django.utils import timezone
import uuid
import json

# Create your views here.
# def hocphan(request):
#     ghidanh = models.KQGhidanh.objects.select_related('mahp', 'masv').all()  # Lấy dữ liệu từ bảng liên quan
#     dangky = models.HPGhiDanh.objects.select_related('mahp').all()  # Lấy dữ liệu từ bảng liên quan
#     context = {
#         'hpghidanh': hpghidanh,
#         'kqghidanh': kqghidanh
#     }

#     return render(request, 'pages/ghi_danh.html', context)


def ghi_danh(request):
    hptc = models.HP.objects.filter(loai='Tự chọn')
    kqdk = models.LS.objects.all()
    context = {
        'hptc': hptc,
        'kqdk': kqdk
    }
    return render(request, 'pages/ghi_danh.html', context)

@require_http_methods(["DELETE"])
def xoa_hoc_phan(request, mahp):
    try:
        # Thay đổi từ get() thành filter().delete()
        ls = models.LS.objects.filter(mahp__mahp=mahp).delete()
        return JsonResponse({
            'status': 'success',
            'message': 'Đã xóa học phần thành công'
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

def dang_ky(request):    
    hpbb = models.HP.objects.filter(loai='Bắt buộc')
    hptc = models.HP.objects.filter(
        ttht__tinhtrang__in=['Qua môn','Trượt môn'],
        loai='Tự chọn'
    ).values('mahp', 'tenhp', 'sotc', 'loai').distinct()
    hphl = models.HP.objects.filter(
        ttht__tinhtrang='Trượt môn',
        loai='Bắt buộc'
    ).values('mahp', 'tenhp', 'sotc', 'loai').distinct()
    kqdk = models.LS.objects.all()

    context = {
        'hpbb': hpbb,
        'hptc': hptc,
        'hphl': hphl,
        'kqdk': kqdk
    }

    return render(request, 'pages/register.html', context)

def get_lophocphan(request):
    mahp = request.GET.get('mahp')
    if mahp:
        # Lấy danh sách lớp học phần theo mã học phần
        lophocphans = models.LHP.objects.filter(mahp=mahp).values(
            'malhp', 'giangvien', 'sosvtoida', 'lichhoc', 'phonghoc'
        )
        return JsonResponse(list(lophocphans), safe=False)
    return JsonResponse({'error': 'Không có mã học phần'}, status=400)

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

def qlihp(request):
    hp = models.LHP.objects.all()
    context = {
        'hp': hp
    }

    return render(request, 'pages/qlihp.html', context)

###
def history(request):
    kqgd = models.LS.objects.select_related('mahp', 'masv').all()
    context = {
        'kqgd': kqgd
    }
    
    return render(request, 'pages/history.html', context)

def timing(request):
    # Xử lý logic cho trang Hẹn giờ đăng ký (nếu cần)
    return render(request, 'pages/timing.html')

def author(request):
    return render(request, 'pages/author.html')

@require_http_methods(["POST"])
def them_hoc_phan(request, mahp):
    try:
        # Lấy thông tin học phần
        hp = models.HP.objects.get(mahp=mahp)
        
        # Lấy mã tài khoản từ session
        matk = request.session.get('user_id')
        
        # Kiểm tra sinh viên có tồn tại không
        try:
            sinh_vien = models.TTSV.objects.get(matk=matk)
        except models.TTSV.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Không tìm thấy thông tin sinh viên'
            }, status=404)

        # Kiểm tra xem đã đăng ký học phần này chưa
        if models.LS.objects.filter(masv=sinh_vien, mahp=hp).exists():
            return JsonResponse({
                'status': 'error', 
                'message': 'Bạn đã đăng ký học phần này rồi'
            }, status=400)

        # Tạo mã LS mới
        import uuid
        mals = f"LS{str(uuid.uuid4())[:6].upper()}"
        
        # Lấy lớp học phần đầu tiên của học phần này
        lhp = models.LHP.objects.filter(mahp=hp).first()
        if not lhp:
            return JsonResponse({
                'status': 'error',
                'message': 'Không tìm thấy lớp học phần'
            }, status=404)

        # Tạo bản ghi mới trong LS
        ls = models.LS.objects.create(
            mals=mals,
            hoatdong='Đăng ký',
            masv=sinh_vien,
            mahp=hp,
            malhp=lhp,
            trangthai='Chờ duyệt',
            thoigian=timezone.now()
        )
        
        return JsonResponse({
            'status': 'success',
            'message': 'Đã thêm học phần thành công',
            'data': {
                'mahp': hp.mahp,
                'tenhp': hp.tenhp,
                'sotc': hp.sotc,
                'loai': hp.loai,
                'giangvien': lhp.giangvien if lhp else None,
                'lichhoc': lhp.lichhoc if lhp else None
            }
        })

    except models.HP.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Không tìm thấy học phần'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
    
@require_http_methods(["POST"])
def dang_ky_hoc_phan(request, mahp):
    try:
        # Parse dữ liệu JSON từ body của yêu cầu
        data = json.loads(request.body)
        malhp = data.get('malhp')
        if not malhp:
            return JsonResponse({
                'status': 'error',
                'message': 'Thiếu mã lớp học phần'
            }, status=400)

        # Lấy thông tin học phần
        hp = models.HP.objects.get(mahp=mahp)

        # Lấy thông tin lớp học phần dựa trên malhp
        lhp = models.LHP.objects.get(malhp=malhp, mahp=hp)

        # Lấy mã tài khoản từ session
        matk = request.session.get('user_id')

        # Kiểm tra sinh viên có tồn tại không
        try:
            sinh_vien = models.TTSV.objects.get(matk=matk)
        except models.TTSV.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Không tìm thấy thông tin sinh viên'
            }, status=404)

        # Kiểm tra xem đã đăng ký học phần này chưa
        if models.LS.objects.filter(masv=sinh_vien, mahp=hp).exists():
            return JsonResponse({
                'status': 'error',
                'message': 'Bạn đã đăng ký học phần này rồi'
            }, status=400)

        # Tạo mã LS mới
        mals = f"LS{str(uuid.uuid4())[:6].upper()}"

        # Tạo bản ghi mới trong LS
        ls = models.LS.objects.create(
            mals=mals,
            hoatdong='Đăng ký',
            masv=sinh_vien,
            mahp=hp,
            malhp=lhp,
            trangthai='Chờ duyệt',
            thoigian=timezone.now()
        )

        # Trả về phản hồi thành công
        return JsonResponse({
            'status': 'success',
            'message': 'Đã đăng ký học phần thành công',
            'data': {
                'mahp': hp.mahp,
                'tenhp': hp.tenhp,
                'sotc': hp.sotc,
                'loai': hp.loai,
                'giangvien': lhp.giangvien,
                'lichhoc': lhp.lichhoc,
                'phonghoc': lhp.phonghoc
            }
        })

    except models.HP.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Không tìm thấy học phần'
        }, status=404)
    except models.LHP.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Không tìm thấy lớp học phần'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)