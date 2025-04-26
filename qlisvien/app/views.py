from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from . import models
from django.utils import timezone

def ghi_danh(request):
    # Xử lý các request khác nhau dựa vào method và query parameters
    
    # Lấy mã tài khoản từ session
    matk = request.session.get('user_id')
    if not matk and request.method != 'GET':
        return JsonResponse({
            'status': 'error',
            'message': 'Chưa đăng nhập'
        }, status=401)
    
    # Lấy sinh viên nếu đã đăng nhập
    sinh_vien = None
    if matk:
        try:
            sinh_vien = models.TTSV.objects.get(matk=matk)
        except models.TTSV.DoesNotExist:
            if request.method != 'GET' or 'action' in request.GET:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Không tìm thấy thông tin sinh viên'
                }, status=404)
    
    # XỬ LÝ THÊM HỌC PHẦN (POST with action=add)
    if request.method == 'POST' and request.GET.get('action') == 'add':
        mahp = request.GET.get('mahp')
        if not mahp:
            return JsonResponse({
                'status': 'error',
                'message': 'Thiếu mã học phần'
            }, status=400)
        
        try:
            # Lấy thông tin học phần
            hp = models.HP.objects.get(mahp=mahp)
            
            # Kiểm tra xem đã đăng ký học phần này chưa
            if models.LS.objects.filter(masv=sinh_vien, mahp=hp).exists():
                return JsonResponse({
                    'status': 'error', 
                    'message': 'Bạn đã đăng ký học phần này rồi'
                }, status=400)
            
            # Xử lý lớp học phần - lấy lớp đầu tiên
            lhp = models.LHP.objects.filter(mahp=hp).first()
            if not lhp:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Không tìm thấy lớp học phần'
                }, status=404)
            
            # Tạo mã LS mới
            import uuid
            mals = f"LS{str(uuid.uuid4())[:6].upper()}"
            
            # Tạo bản ghi mới trong LS
            ls = models.LS.objects.create(
                mals=mals,
                hoatdong='Ghi danh',
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
                    'giangvien': lhp.giangvien,
                    'lichhoc': lhp.lichhoc,
                    'phonghoc': lhp.phonghoc if hasattr(lhp, 'phonghoc') else None
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
    
    # XỬ LÝ XÓA HỌC PHẦN (DELETE with action=delete)
    elif request.method == 'DELETE' and request.GET.get('action') == 'delete':
        mahp = request.GET.get('mahp')
        if not mahp:
            return JsonResponse({
                'status': 'error',
                'message': 'Thiếu mã học phần'
            }, status=400)
        
        try:
            # Xóa bản ghi LS của sinh viên hiện tại
            ls = models.LS.objects.filter(masv=sinh_vien, mahp__mahp=mahp).delete()
            
            if ls[0] > 0:  # Kiểm tra xem có bản ghi nào bị xóa không
                return JsonResponse({
                    'status': 'success',
                    'message': 'Đã xóa học phần thành công'
                })
            else:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Không tìm thấy học phần để xóa'
                }, status=404)
                
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    
    # HIỂN THỊ TRANG GHI DANH (GET without action)
    elif request.method == 'GET' and 'action' not in request.GET:
        # is_student = phanquyen(request)
        hptc = models.HP.objects.filter(loai='Tự chọn')
        kqdk = models.LS.objects.all()
        context = {
            'hptc': hptc,
            'kqdk': kqdk,
            # 'is_student': is_student,
        }
        return render(request, 'pages/ghi_danh.html', context)
    
    # Xử lý các request không hợp lệ
    else:
        return JsonResponse({
            'status': 'error',
            'message': 'Phương thức không được hỗ trợ'
        }, status=405)

def get_lophocphan(request):
    mahp = request.GET.get('mahp')
    if mahp:
        # Lấy danh sách lớp học phần theo mã học phần
        lophocphans = models.LHP.objects.filter(mahp=mahp).values(
            'malhp', 'giangvien', 'sosvtoida', 'lichhoc', 'phonghoc'
        )
        return JsonResponse(list(lophocphans), safe=False)
    return JsonResponse({'error': 'Không có mã học phần'}, status=400)

def dashboard(request):
    # Kiểm tra session
    if not request.session.get('user_id'):
        return redirect('login')
    
    # Lấy mã tài khoản từ session
    matk = request.session.get('user_id')
    if not matk and request.method != 'GET':
        return JsonResponse({
            'status': 'error',
            'message': 'Chưa đăng nhập'
        }, status=401)
    
    # Lấy sinh viên nếu đã đăng nhập
    taikhoan = None
    if matk:
        try:
            taikhoan = models.TaiKhoan.objects.get(matk=matk)
        except models.TaiKhoan.DoesNotExist:
            if request.method != 'GET' or 'action' in request.GET:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Không tìm thấy thông tin'
                }, status=404)

    is_student = taikhoan.vaitro == 'Người dùng' if taikhoan else False

        
    context = {
        'username': request.session.get('username'),
        'show_notification': request.session.get('show_welcome', False),
        'is_student': is_student,
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
            
            return redirect('ghi_danh')
            
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
    
    is_student = phanquyen(request)

    context = {
        'is_student': is_student
    }
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
    
    return render(request, 'pages/change_password.html', context)

def dang_ky(request):
    # Xử lý các request khác nhau dựa vào method và query parameters
    
    # Lấy mã tài khoản từ session
    matk = request.session.get('user_id')
    if not matk and request.method != 'GET':
        return JsonResponse({
            'status': 'error',
            'message': 'Chưa đăng nhập'
        }, status=401)
    
    # Lấy sinh viên nếu đã đăng nhập
    sinh_vien = None
    if matk:
        try:
            sinh_vien = models.TTSV.objects.get(matk=matk)
        except models.TTSV.DoesNotExist:
            if request.method != 'GET' or 'action' in request.GET:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Không tìm thấy thông tin sinh viên'
                }, status=404)
    
    # XỬ LÝ THÊM LỚP HỌC PHẦN (POST with action=add)
    if request.method == 'POST' and request.GET.get('action') == 'add':
        malhp = request.GET.get('malhp')
        if not malhp:
            return JsonResponse({
                'status': 'error',
                'message': 'Thiếu mã lớp học phần'
            }, status=400)
        
        try:
            # Lấy thông tin
            lhp = models.LHP.objects.get(malhp=malhp)
            hp = lhp.mahp

            # cần đổi tên biến này
            # Kiểm tra xem sinh viên đã đăng ký học phần này hay chưa
            existing_registration = models.LS.objects.filter(masv=sinh_vien, mahp=hp)
            
            # Kiểm tra lhp đã đăng ký chưa
            if existing_registration.exists():
                if existing_registration.filter(malhp=lhp).exists():
                    return JsonResponse({
                        'status': 'error', 
                        'message': 'Bạn đã đăng ký học phần này rồi'
                    }, status=400)
                
                # Xóa đăng ký lớp cũ
                existing_registration.delete()
                message_prefix = "Đã chuyển lớp học phần thành công"
            else:
                message_prefix = "Đã đăng ký học phần thành công"

            if not lhp:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Không tìm thấy lớp học phần'
                }, status=404)
            
            # Tạo mã LS mới
            import uuid
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
            
            return JsonResponse({
                'status': 'success',
                'message': message_prefix ,
                'data': {
                    'mahp': hp.mahp,
                    'tenhp': hp.tenhp,
                    'sotc': hp.sotc,
                    'loai': hp.loai,
                    'giangvien': lhp.giangvien,
                    'lichhoc': lhp.lichhoc,
                    'phonghoc': lhp.phonghoc if hasattr(lhp, 'phonghoc') else None
                }
            })
            
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
    
    # XỬ LÝ XÓA LỚP HỌC PHẦN (DELETE with action=delete)
    elif request.method == 'DELETE' and request.GET.get('action') == 'delete':
        mahp = request.GET.get('mahp')
        if not mahp:
            return JsonResponse({
                'status': 'error',
                'message': 'Thiếu mã lớp học phần'
            }, status=400)
        
        try:
            # Xóa bản ghi LS của sinh viên hiện tại
            # Xóa bản ghi LS của sinh viên hiện tại theo mã học phần
            deleted_count = models.LS.objects.filter(masv=sinh_vien, mahp__mahp=mahp).delete()[0]
            
            if deleted_count  > 0:  # Kiểm tra xem có bản ghi nào bị xóa không
                return JsonResponse({
                    'status': 'success',
                    'message': 'Đã xóa lớp học phần thành công'
                })
            else:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Không tìm thấy lớp học phần để xóa'
                }, status=404)
                
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    
    # HIỂN THỊ TRANG ĐĂNG KÝ (GET without action)
    elif request.method == 'GET' and 'action' not in request.GET:
        is_student = phanquyen(request)
        hpbb = models.HP.objects.filter(loai='Bắt buộc')
        hptc = models.HP.objects.filter(loai='Tự chọn')
        hphl = models.HP.objects.filter(loai='Bắt buộc')
        lhp = models.LHP.objects.all()
        kqdk = models.LS.objects.all()
        context = {
            'hpbb': hpbb,
            'hptc': hptc,
            'hphl': hphl,
            'lhp': lhp,
            'kqdk': kqdk,
            'is_student': is_student,
        }
        return render(request, 'pages/register.html', context)
    
    # Xử lý các request không hợp lệ
    else:
        return JsonResponse({
            'status': 'error',
            'message': 'Phương thức không được hỗ trợ'
        }, status=405)

def qlihp(request):
    # XỬ LÝ THÊM LỚP HỌC PHẦN (POST with action=add)
    if request.method == 'POST' and request.GET.get('action') == 'add':
        import json
        try:
            # Lấy dữ liệu từ request
            data = json.loads(request.body)
            
            # Kiểm tra dữ liệu bắt buộc
            if not data.get('manganh') or not data.get('mahp') or not data.get('malhp'):
                return JsonResponse({
                    'status': 'error',
                    'message': 'Thiếu thông tin bắt buộc'
                }, status=400)
            
            # Kiểm tra học phần đã tồn tại chưa
            try:
                hp = models.HP.objects.get(mahp=data.get('mahp'))
            except models.HP.DoesNotExist:
                # Tạo học phần mới nếu chưa tồn tại
                try:
                    nganh = models.NH.objects.get(manganh=data.get('manganh'))
                except models.NH.DoesNotExist:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Mã ngành không tồn tại'
                    }, status=404)
                
                hp = models.HP.objects.create(
                    mahp=data.get('mahp'),
                    tenhp=data.get('tenhp', f"Học phần {data.get('mahp')}"),
                    sotc=data.get('sotc', 0),
                    loai=data.get('loai', 'Bắt buộc'),
                    manganh=nganh
                )
            
            # Kiểm tra lớp học phần đã tồn tại chưa
            if models.LHP.objects.filter(malhp=data.get('malhp')).exists():
                return JsonResponse({
                    'status': 'error',
                    'message': 'Mã lớp học phần đã tồn tại'
                }, status=400)
            
            # Tạo lớp học phần mới
            lhp = models.LHP.objects.create(
                malhp=data.get('malhp'),
                mahp=hp,
                giangvien=data.get('giangvien', ''),
                sosvtoida=data.get('sosvtoida', 0),
                lichhoc=data.get('lichhoc', ''),
                phonghoc=data.get('phonghoc', '')
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Đã thêm học phần thành công',
                'data': {
                    'malhp': lhp.malhp,
                    'mahp': hp.mahp,
                    'tenhp': hp.tenhp,
                    'sotc': hp.sotc,
                    'loai': hp.loai,
                    'giangvien': lhp.giangvien
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Dữ liệu không hợp lệ'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
        
    # HIỂN THỊ TRANG QLHP (GET without action)
    elif request.method == 'GET' and 'action' not in request.GET:
        is_student = phanquyen(request)
        lhp = models.LHP.objects.all()
        context = {
            'lhp': lhp,
            'is_student': is_student,
        }        
        return render(request, 'pages/qlihp.html', context)
    
    # Xử lý các request không hợp lệ
    else:
        return JsonResponse({
            'status': 'error',
            'message': 'Phương thức không được hỗ trợ'
        }, status=405)

def history(request):

    ls = models.LS.objects.all()
    is_student = phanquyen(request)

    context = {
        'ls': ls,
        'is_student': is_student
    }
    return render(request, 'pages/history.html', context)

def timing(request):
    # Xử lý logic cho trang Hẹn giờ đăng ký (nếu cần)
    is_student = phanquyen(request)

    context = {

        'is_student': is_student,
    }
    return render(request, 'pages/timing.html', context)

def author(request):
    is_student = phanquyen(request)

    context = {
        'is_student': is_student
    }
    return render(request, 'pages/author.html', context)

def phanquyen(request):
    
    # Lấy mã tài khoản từ session
    matk = request.session.get('user_id')
    if not matk and request.method != 'GET':
        return JsonResponse({
            'status': 'error',
            'message': 'Chưa đăng nhập'
        }, status=401)
    
    # Lấy sinh viên nếu đã đăng nhập
    taikhoan = None
    if matk:
        try:
            taikhoan = models.TaiKhoan.objects.get(matk=matk)
        except models.TaiKhoan.DoesNotExist:
            if request.method != 'GET' or 'action' in request.GET:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Không tìm thấy thông tin'
                }, status=404)

    is_student = taikhoan.vaitro == 'Người dùng' if taikhoan else False

    return is_student

