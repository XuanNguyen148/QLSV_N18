from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from . import models
from django.utils import timezone
from datetime import datetime
import json
from django.core.cache import cache
from django.contrib.auth.signals import user_login_failed
import uuid
from .models import TTSV, HP, LS, TTDK

def ghi_danh(request):
    matk = request.session.get('user_id')
    if not matk and request.method != 'GET':
        return JsonResponse({
            'status': 'error',
            'message': 'Chưa đăng nhập'
        }, status=401)
    
    sinh_vien = None
    if matk:
        try:
            sinh_vien = TTSV.objects.get(matk=matk)
        except TTSV.DoesNotExist:
            if request.method != 'GET' or 'action' in request.GET:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Không tìm thấy thông tin sinh viên'
                }, status=404)
    
    if request.method == 'POST' and request.GET.get('action') == 'add':
        mahp = request.GET.get('mahp')
        if not mahp:
            return JsonResponse({
                'status': 'error',
                'message': 'Thiếu mã học phần'
            }, status=400)
        
        try:
            if TTDK.objects.filter(masv=sinh_vien, mamh=mahp, trangthai='Đăng ký', hoatdong='Ghi danh').exists():
                return JsonResponse({
                    'status': 'error', 
                    'message': 'Bạn đã đăng ký học phần này rồi'
                }, status=400)
            
            mals = f"LS{str(uuid.uuid4())[:6].upper()}"
            
            ls = LS.objects.create(
                mals=mals,
                hoatdong='Ghi danh',
                masv=sinh_vien,
                mamh=mahp,
                trangthai='Đăng ký',
                thoigian=timezone.now()
            )

            try:
                ttdk = TTDK.objects.get(
                    masv=sinh_vien,
                    mamh=mahp,
                    hoatdong='Ghi danh'
                )
                ttdk.trangthai = 'Đăng ký'
                ttdk.mals = ls
                ttdk.save()
            except TTDK.DoesNotExist:
                ttdk = TTDK.objects.create(
                    masv=sinh_vien,
                    mamh=mahp,
                    hoatdong='Ghi danh',
                    trangthai='Đăng ký',
                    mals=ls
                )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Đã thêm học phần thành công'
            })
            
        except HP.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Không tìm thấy học phần'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    
    elif request.method == 'POST' and request.GET.get('action') == 'add_multiple':
        try:
            data = json.loads(request.body)
            courses = data.get('courses', [])
            if not courses:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Danh sách học phần trống'
                }, status=400)
            
            errors = []
            for mahp in courses:
                if TTDK.objects.filter(masv=sinh_vien, mamh=mahp, trangthai='Đăng ký', hoatdong='Ghi danh').exists():
                    errors.append(f"Học phần {mahp} đã được đăng ký")
                    continue
                
                try:
                    HP.objects.get(mahp=mahp)
                    mals = f"LS{str(uuid.uuid4())[:6].upper()}"

                    ls = LS.objects.create(
                        mals=mals,
                        hoatdong='Ghi danh',
                        masv=sinh_vien,
                        mamh=mahp,
                        trangthai='Đăng ký',
                        thoigian=timezone.now()
                    )

                    try:
                        ttdk = TTDK.objects.get(
                            masv=sinh_vien,
                            mamh=mahp,
                            hoatdong='Ghi danh'
                        )
                        ttdk.trangthai = 'Đăng ký'
                        ttdk.mals = ls
                        ttdk.save()
                    except TTDK.DoesNotExist:
                        ttdk = TTDK.objects.create(
                            masv=sinh_vien,
                            mamh=mahp,
                            hoatdong='Ghi danh',
                            trangthai='Đăng ký',
                            mals=ls
                        )
                
                except HP.DoesNotExist:
                    errors.append(f"Học phần {mahp} không tồn tại")
                    continue
                except Exception as e:
                    errors.append(f"Lỗi khi xử lý học phần {mahp}: {str(e)}")
                    continue
            
            if errors:
                return JsonResponse({
                    'status': 'error',
                    'message': '; '.join(errors)
                }, status=400)
            
            return JsonResponse({
                'status': 'success',
                'message': 'Đã đăng ký các học phần thành công'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Dữ liệu JSON không hợp lệ'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    
    # XÓA
    elif request.method == 'DELETE' and request.GET.get('action') == 'delete':
        mahp = request.GET.get('mahp')
        if not mahp:
            return JsonResponse({
                'status': 'error',
                'message': 'Thiếu mã học phần'
            }, status=400)
        
        try:
            mals = f"LS{str(uuid.uuid4())[:6].upper()}"
            
            ls = LS.objects.create(
                mals=mals,
                hoatdong='Ghi danh',
                masv=sinh_vien,
                mamh=mahp,
                trangthai='Hủy đăng ký',
                thoigian=timezone.now()
            )

            try:
                ttdk = TTDK.objects.get(
                    masv=sinh_vien,
                    mamh=mahp,
                    hoatdong='Ghi danh'
                )
                ttdk.trangthai = 'Hủy đăng ký'
                ttdk.mals = ls
                ttdk.save()

                return JsonResponse({
                    'status': 'success',
                    'message': 'Đã xóa học phần thành công'
                })

            except TTDK.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Không tìm thấy học phần cần xóa'
                }, status=404)
                
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    
    # HIỂN THỊ
    elif request.method == 'GET' and 'action' not in request.GET:
        lophc = sinh_vien.lop
        khoa = lophc[:3]
        if khoa == 'K59':
            hptc = HP.objects.filter(loai='Tự chọn', hocky=4, manganh = sinh_vien.manganh)
        elif khoa == 'K60':
            hptc = HP.objects.filter(loai='Tự chọn', hocky=2, manganh = sinh_vien.manganh)
        else:
            hptc = HP.objects.filter(loai='Tự chọn', manganh = sinh_vien.manganh)
            
        kqdk = TTDK.objects.filter(trangthai='Đăng ký', masv=sinh_vien)
        kqdk_hp = []
        for ttdk in kqdk:
            try:
                hp = HP.objects.get(mahp=ttdk.mamh)
                kqdk_hp.append({
                    'ttdk': ttdk,
                    'hp': hp
                })
            except HP.DoesNotExist:
                continue

        context = {
            'hptc': hptc,
            'kqdk': kqdk_hp,
        }
        return render(request, 'pages/ghi_danh.html', context)
    else:
        return JsonResponse({
            'status': 'error',
            'message': 'Phương thức không được hỗ trợ'
        }, status=405)

# hoàn tác trước đây 01
def get_lophocphan(request):
    mahp = request.GET.get('mahp')
    lophocphan = models.LHP.objects.filter(mahp=mahp).select_related('mahp')  # Lấy thông tin từ HP
    data = [
        {
            'malhp': lhp.malhp,
            'mahp': lhp.mahp.mahp,
            'giangvien': lhp.giangvien,
            'sosvtoida': lhp.sosvtoida,
            'lichhoc': lhp.lichhoc,
            'phonghoc': lhp.phonghoc,
            'sotc': lhp.mahp.sotc  # Thêm sotc từ HP
        }
        for lhp in lophocphan
    ]
    return JsonResponse(data, safe=False)

def dashboard(request):           
    return render(request, 'pages/dashboard.html')

def login_view(request):
    debug_info = {
        'post_data': None,
        'found_users': None,
        'last_query': None
    }

    all_users = models.TaiKhoan.objects.all()

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        debug_info['post_data'] = {'username': username, 'password': password}
        key = f'login_fail_{username}'
        fail_count = cache.get(key, 0)

        if fail_count >= 3:
            messages.error(request, 'Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 1000 giây.')
            debug_info['last_query'] = f'Bị chặn do vượt quá {fail_count} lần sai.'
            return render(request, 'pages/login.html', {
                'all_users': all_users,
                'debug_info': debug_info,
                'debug': True
            })

        try:
            user = models.TaiKhoan.objects.get(tendangnhap=username, matkhau=password)
            debug_info['found_users'] = [{'id': user.matk, 'username': user.tendangnhap}]

            cache.delete(key)

            request.session['user_id'] = user.matk
            request.session['username'] = user.tendangnhap
            request.session['show_welcome'] = True

            if user.vaitro == 'Admin':
                return redirect('quan_ly_hoc_phan')
            return redirect('ghi_danh')

        except models.TaiKhoan.DoesNotExist:
            cache.set(key, fail_count + 1, timeout=1000)
            user_login_failed.send(sender=models.TaiKhoan, credentials={'username': username}, request=request)
            debug_info['last_query'] = "Không tìm thấy tài khoản"
            messages.error(request, 'Tài khoản hoặc mật khẩu không chính xác')
        except Exception as e:
            debug_info['last_query'] = str(e)
            messages.error(request, f'Lỗi: {str(e)}')

    return render(request, 'pages/login.html', {
        'all_users': all_users,
        'debug_info': debug_info,
        'debug': True
    })


def logout_view(request):
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
            user = models.TaiKhoan.objects.get(
                matk=request.session.get('user_id'),
                matkhau=current_password
            )
            
            if new_password != confirm_password:
                messages.error(request, 'Mật khẩu mới và xác nhận mật khẩu không khớp')
                return redirect('change_password')
            
            user.password = new_password
            user.save()
            
            messages.success(request, 'Đổi mật khẩu thành công')
            
        except models.CustomUser.DoesNotExist:
            messages.error(request, 'Mật khẩu hiện tại không đúng')
        except Exception as e:
            messages.error(request, f'Có lỗi xảy ra: {str(e)}')
    
    return render(request, 'pages/change_password.html')

def dang_ky(request):
      
    matk = request.session.get('user_id')
    if not matk and request.method != 'GET':
        return JsonResponse({
            'status': 'error',
            'message': 'Chưa đăng nhập'
        }, status=401)
    
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
    
    # THÊM
    import uuid
    if request.method == 'POST' and request.GET.get('action') == 'add':
        malhp = request.GET.get('malhp')
        if not malhp:
            return JsonResponse({
                'status': 'error',
                'message': 'Thiếu mã lớp học phần'
            }, status=400)
        try:
            lhp = models.LHP.objects.get(malhp=malhp)
            mamh = lhp.malhp
            current_registrations = models.TTDK.objects.filter(
                mamh=malhp,
                trangthai='Đăng ký',
                hoatdong='Đăng ký'
            ).count()
            if lhp.sosvtoida is not None and current_registrations >= lhp.sosvtoida:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Lớp học phần đã đủ số lượng sinh viên tối đa'
                }, status=400)

            ttdk_qs = models.TTDK.objects.filter(
                masv=sinh_vien,
                trangthai='Đăng ký',
                hoatdong='Đăng ký'
            )
            ttdk_qs2 = models.TTDK.objects.filter(
                masv=sinh_vien,
                hoatdong='Đăng ký'
            )
            malhp_2 = malhp[:-2]

            # Kiểm tra trùng lịch
            registered_lhps = models.TTDK.objects.filter(
                masv=sinh_vien,
                trangthai='Đăng ký',
                hoatdong='Đăng ký'
            ).values_list('mamh', flat=True)

            if models.LHP.objects.filter(
                malhp__in=registered_lhps,
                lichhoc=lhp.lichhoc
            ).exclude(malhp=malhp).exists():
                return JsonResponse({
                    'status': 'error',
                    'message': 'Trùng lịch: ' + str(models.LHP.objects.filter(malhp__in=registered_lhps, lichhoc=lhp.lichhoc).exclude(malhp=malhp).first().mahp.tenhp)
                }, status=400)
            try:
                if ttdk_qs2.filter(mamh=malhp).exists():
                    ttdk_qs3=ttdk_qs2.filter(mamh=malhp).filter(trangthai='Đăng ký')
                    if ttdk_qs3.exists():
                        return JsonResponse({
                            'status': 'error',
                            'message': 'Bạn đã đăng ký lớp học phần này rồi 2 ' + str(malhp)
                        }, status=400)
                    else:
                        try:
                            mals = f"LS{str(uuid.uuid4())[:6].upper()}"
                            ls = models.LS.objects.create(
                                mals=mals,
                                hoatdong='Đăng ký',
                                masv=sinh_vien,
                                mamh=mamh,
                                trangthai='Đăng ký',
                                thoigian=timezone.now()
                            )                                
                        except Exception as e:
                            return JsonResponse({
                                'status': 'error',
                                'message': str(e) + ' chào a1'
                            }, status=500)
                        try:
                            ttdk_list = models.TTDK.objects.filter(mamh__startswith=malhp_2, masv=sinh_vien, hoatdong='Đăng ký')
                            if ttdk_list.exists():
                                ttdk_list.filter(trangthai='Đăng ký').update(trangthai='Hủy đăng ký')
                                ttdk_list.filter(mamh=mamh).update(mals=ls, trangthai='Đăng ký')
                                return JsonResponse({
                                    'status': 'success',
                                    'message': 'Đã thêm học phần thành công 2'
                                })
                            else:
                                print("Không tìm thấy TTDK với mamh =", mamh)
                        except Exception as e:
                            return JsonResponse({
                                'status': 'error',
                                'message': str(e) + ' chào a2'
                            }, status=500)
                elif ttdk_qs.filter(mamh__startswith=malhp_2).exists():
                    try:
                        if ttdk_qs.filter(mamh=mamh).exists():
                            return JsonResponse({
                                'status': 'error',
                                'message': 'Bạn đã đăng ký lớp học phần này rồi'
                            }, status=400)
                        else:
                            try:
                                try:
                                    import uuid
                                    mals = f"LS{str(uuid.uuid4())[:6].upper()}"
                                    ls = models.LS.objects.create(
                                        mals=mals,
                                        hoatdong='Đăng ký',
                                        masv=sinh_vien,
                                        mamh=mamh,
                                        trangthai='Đăng ký',
                                        thoigian=timezone.now()
                                    )                                
                                except Exception as e:
                                    return JsonResponse({
                                        'status': 'error',
                                        'message': str(e) + ' chào 9.2.1'
                                    }, status=500)
                                try:
                                    ttdk = models.TTDK.objects.get(mamh__startswith=malhp_2, masv=sinh_vien)
                                    if ttdk:
                                        ttdk.mamh = mamh
                                        ttdk.mals = ls
                                        ttdk.save()
                                        return JsonResponse({
                                            'status': 'success',
                                            'message': 'Đã đổi học phần thành công'
                                        })
                                    else:
                                        print("Không tìm thấy TTDK với mamh =", mamh)
                                except Exception as e:
                                    return JsonResponse({
                                        'status': 'error',
                                        'message': str(e) + ' chào 3.1' + ' ' + str(ttdk)
                                    }, status=500)

                            
                            except Exception as e:
                                return JsonResponse({
                                    'status': 'error',
                                    'message': str(e) + ' chào 9.2'
                                }, status=500)
                    except Exception as e:
                        return JsonResponse({
                            'status': 'error',
                            'message': str(e) + ' chào 9.1'
                        }, status=500)
                else:
                    import uuid
                    mals = f"LS{str(uuid.uuid4())[:6].upper()}"

                    ls = models.LS.objects.create(
                        mals=mals,
                        hoatdong='Đăng ký',
                        masv=sinh_vien,
                        mamh=mamh,  # Use course code here
                        trangthai='Đăng ký',
                        thoigian=timezone.now()
                    )
                    ttdk = models.TTDK.objects.create(
                        masv=sinh_vien,
                        mamh=mamh,
                        hoatdong='Đăng ký',
                        trangthai='Đăng ký',
                        mals=ls
                    )

                    return JsonResponse({
                        'status': 'success',
                        'message': 'Đã thêm học phần thành công'
                    })

            except Exception as e:
                return JsonResponse({
                    'status': 'error',
                    'message': str(e) + ' chào 9'
                }, status=500)

        except models.LHP.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Không tìm thấy lớp học phần'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e) + ' chào z'
            }, status=500)
        
    # hoàn tác trước đây 01
    # THÊM NHIỀU
    elif request.method == 'POST' and request.GET.get('action') == 'add_multiple':
        try:
            data = json.loads(request.body)
            classes = data.get('classes', [])
            if not classes:
                return JsonResponse({'status': 'error', 'message': 'Danh sách lớp học phần trống'}, status=400)

            errors = []
            for malhp in classes:
                try:
                    try:
                        lhp = models.LHP.objects.get(malhp=malhp)
                        mamh = lhp.malhp
                        current_registrations = models.TTDK.objects.filter(
                            mamh=malhp,
                            trangthai='Đăng ký',
                            hoatdong='Đăng ký'
                        ).count()
                        if lhp.sosvtoida is not None and current_registrations >= lhp.sosvtoida:
                            errors.append(f"Lớp học phần {malhp} đã đủ số lượng sinh viên tối đa")
                            continue

                        # Kiểm tra trùng lịch
                        registered_lhps = models.TTDK.objects.filter(
                            masv=sinh_vien,
                            trangthai='Đăng ký',
                            hoatdong='Đăng ký'
                        ).values_list('mamh', flat=True)
                        if models.LHP.objects.filter(
                            malhp__in=registered_lhps,
                            lichhoc=lhp.lichhoc
                        ).exclude(malhp=malhp).exists():
                            conflicting_lhp = models.LHP.objects.filter(
                                malhp__in=registered_lhps,
                                lichhoc=lhp.lichhoc
                            ).exclude(malhp=malhp).first()
                            errors.append(f"Trùng lịch với {conflicting_lhp.malhp}")
                            continue

                        malhp_2 = malhp[:-2]
                        ttdk_qs = models.TTDK.objects.filter(
                            masv=sinh_vien,
                            trangthai='Đăng ký',
                            hoatdong='Đăng ký'
                        )
                        ttdk_qs2 = models.TTDK.objects.filter(
                            masv=sinh_vien,
                            hoatdong='Đăng ký'
                        )
                    except Exception as e:
                        errors.append(f"Lỗi 0201 khi xử lý lớp học phần {malhp}: {str(e)}")
                        continue

                    try:
                        if ttdk_qs2.filter(mamh=malhp).exists():
                            try:
                                if ttdk_qs2.filter(mamh=malhp, trangthai='Đăng ký').exists():
                                    errors.append(f"Bạn đã đăng ký lớp học phần {malhp} rồi")
                                    continue
                                else:
                                    mals = f"LS{str(uuid.uuid4())[:6].upper()}"
                                    ls = models.LS.objects.create(
                                        mals=mals,
                                        hoatdong='Đăng ký',
                                        masv=sinh_vien,
                                        mamh=mamh,
                                        trangthai='Đăng ký',
                                        thoigian=timezone.now()
                                    )
                                    ttdk_list = models.TTDK.objects.filter(mamh__startswith=malhp_2, masv=sinh_vien, hoatdong='Đăng ký')
                                    ttdk_list.filter(trangthai='Đăng ký').update(trangthai='Hủy đăng ký')
                                    ttdk_list.filter(mamh=mamh).update(mals=ls, trangthai='Đăng ký')
                            except Exception as e:
                                errors.append(f"Lỗi 0203 khi xử lý lớp học phần {malhp}: {str(e)}")
                                continue
                        elif ttdk_qs.filter(mamh__startswith=malhp_2).exists():
                            try:
                                if not ttdk_qs.filter(mamh=mamh).exists():
                                    mals = f"LS{str(uuid.uuid4())[:6].upper()}"
                                    ls = models.LS.objects.create(
                                        mals=mals,
                                        hoatdong='Đăng ký',
                                        masv=sinh_vien,
                                        mamh=mamh,
                                        trangthai='Đăng ký',
                                        thoigian=timezone.now()
                                    )
                                    ttdk = models.TTDK.objects.get(mamh__startswith=malhp_2, masv=sinh_vien, hoatdong='Đăng ký')
                                    ttdk.mamh = mamh
                                    ttdk.mals = ls
                                    ttdk.save()
                            except Exception as e:
                                errors.append(f"Lỗi 0204 khi xử lý lớp học phần {malhp}: {str(e)}")
                                continue
                        else:
                            mals = f"LS{str(uuid.uuid4())[:6].upper()}"
                            ls = models.LS.objects.create(
                                mals=mals,
                                hoatdong='Đăng ký',
                                masv=sinh_vien,
                                mamh=mamh,
                                trangthai='Đăng ký',
                                thoigian=timezone.now()
                            )
                            models.TTDK.objects.create(
                                masv=sinh_vien,
                                mamh=mamh,
                                hoatdong='Đăng ký',
                                trangthai='Đăng ký',
                                mals=ls
                            )
                    except Exception as e:
                        errors.append(f"Lỗi 0202 khi xử lý lớp học phần {malhp}: {str(e)}")
                        continue
                except models.LHP.DoesNotExist:
                    errors.append(f"Lớp học phần {malhp} không tồn tại")
                    continue
                except Exception as e:
                    errors.append(f"Lỗi 0200 khi xử lý lớp học phần {malhp}: {str(e)}")
                    continue

            if errors:
                return JsonResponse({'status': 'error', 'message': '; '.join(errors)}, status=400)
            return JsonResponse({'status': 'success', 'message': 'Đã đăng ký các lớp học phần thành công'})
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Dữ liệu JSON không hợp lệ'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


    # XÓA
    elif request.method == 'DELETE' and request.GET.get('action') == 'delete':
        mahp = request.GET.get('mahp')
        if not mahp:
            return JsonResponse({
                'status': 'error',
                'message': 'Thiếu mã lớp học phần'
            }, status=400)
        try:
            import uuid
            mals = f"LS{str(uuid.uuid4())[:6].upper()}"
            ls = models.LS.objects.create(
                mals=mals,
                hoatdong='Đăng ký',
                masv=sinh_vien,
                mamh = mahp,
                trangthai='Hủy đăng ký',
                thoigian=timezone.now()
            )

            try:
                ttdk = models.TTDK.objects.get(
                    masv=sinh_vien,
                    mamh=mahp,
                    hoatdong='Đăng ký'
                )
                ttdk.trangthai = 'Hủy đăng ký'
                ttdk.mals = ls
                ttdk.save()

                return JsonResponse({
                'status': 'success',
                'message': 'Đã xóa học phần thành công'
            })

            except models.TTDK.DoesNotExist:
                return JsonResponse({
                'status': 'error',
                'message': 'Không tìm thấy học phần cần xóa'
            }, status=404)
                
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e) + ' chào 2'
            }, status=500)


    # HIỂN THỊ
    elif request.method == 'GET' and 'action' not in request.GET:
        lophc = sinh_vien.lop
        khoa = lophc[:3]
        if khoa == 'K59':
            hocky = 4
        elif khoa == 'K60':
            hocky = 2
        try:
            hpbb = models.HP.objects.filter(loai='Bắt buộc', hocky=hocky, manganh = sinh_vien.manganh)
            hptc = models.HP.objects.filter(loai='Tự chọn', hocky=hocky, manganh = sinh_vien.manganh)
        except:
            hpbb = models.HP.objects.filter(loai='Bắt buộc', manganh = sinh_vien.manganh)
            hptc = models.HP.objects.filter(loai='Tự chọn', manganh = sinh_vien.manganh)
        kqtc_gd = []
        for tc in hptc:
            try:
                kqgd = models.TTDK.objects.filter(mamh=tc.mahp, hoatdong='Ghi danh', trangthai='Đăng ký', masv=sinh_vien)
                for gd in kqgd:
                    kqtc_gd.append({
                        'tc': tc,
                        'kqgd': gd
                    })
            except models.HP.DoesNotExist:
                continue
        hphl = models.HP.objects.filter(loai='Bắt buộc')
        hphl = models.HP.objects.filter(
            loai='Bắt buộc',
            ttht__tinhtrang='Rớt môn',
            ttht__masv=sinh_vien
        ).distinct()
        lhp = models.LHP.objects.all()
        kqdk = models.TTDK.objects.filter(trangthai='Đăng ký', masv=sinh_vien)
        kqdk_lhp = []
        for ttdk in kqdk:
            try:
                kqlhp = models.LHP.objects.get(malhp=ttdk.mamh)
                kqdk_lhp.append({
                    'ttdk': ttdk,
                    'lhp': kqlhp
                })
            except models.LHP.DoesNotExist:
                continue
        context = {
            'hpbb': hpbb,
            'hptc': hptc,
            'hphl': hphl,
            'lhp': lhp,
            'kqdk': kqdk_lhp,
            'kqtc_gd': kqtc_gd,
        }
        return render(request, 'pages/register.html', context)
    
    else:
        return JsonResponse({
            'status': 'error',
            'message': 'Phương thức không được hỗ trợ'
        }, status=405)

def qlihp(request):
    role = phanquyen(request)
    if role == None:
        return JsonResponse({
            'status': 'error',
            'message': 'Không được phép truy cập'
        }, status=404)
    # THÊM
    if request.method == 'POST' and request.GET.get('action') == 'add':
        import json
        try:
            data = json.loads(request.body)
            
            if not data.get('manganh') or not data.get('mahp') or not data.get('malhp'):
                return JsonResponse({
                    'status': 'error',
                    'message': 'Thiếu thông tin bắt buộc'
                }, status=400)
            
            try:
                hp = models.HP.objects.get(mahp=data.get('mahp'))
                nganh = models.NH.objects.get(manganh=data.get('manganh'))
            except models.HP.DoesNotExist or models.NH.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Lớp học phần/Mã ngành không hợp lệ'
                }, status=404)
            
            if models.LHP.objects.filter(malhp=data.get('malhp')).exists():
                return JsonResponse({
                    'status': 'error',
                    'message': 'Mã lớp học phần đã tồn tại'
                }, status=400)
            
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


    # CHỈNH SỬA
    elif request.method == 'PUT' and request.GET.get('action') == 'edit':
        import json
        try:
            data = json.loads(request.body)
            
            if not data.get('malhp'):
                return JsonResponse({
                    'status': 'error',
                    'message': 'Thiếu mã lớp học phần'
                }, status=400)
            
            try:
                lhp = models.LHP.objects.get(malhp=data.get('malhp'))
            except models.LHP.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Không tìm thấy lớp học phần'
                }, status=404)

            try:
                lhp.giangvien = data.get('giangvien', lhp.giangvien)
                lhp.sosvtoida = data.get('sosvtoida', lhp.sosvtoida)
                lhp.lichhoc = data.get('lichhoc', lhp.lichhoc)
                lhp.phonghoc = data.get('phonghoc', lhp.phonghoc)
                lhp.save()
            except Exception as e:
                return JsonResponse({
                    'status': 'error',
                    'message': str(e) + ' lỗi edit 3'
                }, status=500)
            return JsonResponse({
                'status': 'success',
                'message': 'Đã cập nhật học phần thành công',
                'data': {
                    'malhp': lhp.malhp,
                    'giangvien': lhp.giangvien,
                    'sosvtoida': lhp.sosvtoida,
                    'lichhoc': lhp.lichhoc,
                    'phonghoc': lhp.phonghoc
                }
            })
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Dữ liệu không hợp lệ lỗi edit'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e) + ' lỗi edit 2'
            }, status=500)

    # HIỂN THỊ
    elif request.method == 'GET' and 'action' not in request.GET:
        lhp = models.LHP.objects.all()
        context = {
            'lhp': lhp,
        }        
        return render(request, 'pages/qlihp.html', context)
    
    elif request.method == 'DELETE':
        malhp = request.GET.get('malhp')
        lhp = models.LHP.objects.filter(malhp=malhp)
        lhp.delete()
        return JsonResponse({'status': 'success', 'message': 'Học phần đã được xóa'})
    
    else:
        return JsonResponse({
            'status': 'error',
            'message': 'Phương thức không được hỗ trợ'
        }, status=405)

def history(request):
    matk = request.session.get('user_id')
    if not matk and request.method != 'GET':
        return JsonResponse({
            'status': 'error',
            'message': 'Chưa đăng nhập'
        }, status=401)
    
    sinh_vien = None
    if matk:
        try:
            sinh_vien = models.TTSV.objects.get(matk=matk)
        except models.TTSV.DoesNotExist:
            sinh_vien = models.TTNS.objects.get(matk=matk)
            if request.method != 'GET' or 'action' in request.GET:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Không tìm thấy thông tin sinh viên'
                }, status=404)
    
    if sinh_vien.matk.vaitro == 'Admin':
        kqdk = models.LS.objects.filter(hoatdong='Đăng ký')
    else:
        kqdk = models.LS.objects.filter(hoatdong='Đăng ký', masv=sinh_vien)
    kqdk_lhp = []
    for ls in kqdk:
        try:
            lhp = models.LHP.objects.get(malhp=ls.mamh)
            kqdk_lhp.append({
                'ls': ls,
                'lhp': lhp
            })
        except models.LHP.DoesNotExist:
            continue

    context = {
        'kqdk': kqdk_lhp,
    }
    return render(request, 'pages/history.html', context)

def timing(request):    
    role = phanquyen(request)
    if role != 'Admin':
        return JsonResponse({
            'status': 'error',
            'message': 'Không được phép truy cập'
        }, status=404)

    if request.method == 'POST':
        timing_type = request.POST.get('type')
        start_time = request.POST.get('start_time') + ' +0700'
        end_time = request.POST.get('end_time') + ' +0700'
        
        if not all([timing_type, start_time, end_time]):
            return JsonResponse({'status': 'error', 'message': 'Thiếu thông tin cần thiết'})
        
        try:
            try:
                date_format = "%Y-%m-%dT%H:%M "
                date_format += "%z"
                start_datetime = datetime.strptime(start_time, date_format)
                end_datetime = datetime.strptime(end_time, date_format)
            except Exception as e:
                return JsonResponse({'status': 'error', 'message': 'lỗi ở đây ' + str(start_time) + ' ' + str(end_time)})

            if start_datetime >= end_datetime:
                return JsonResponse({'status': 'error', 'message': 'Thời gian bắt đầu phải trước thời gian kết thúc'})
            
            loai_dk = 'dang_ky' if timing_type == 'register' else 'ghi_danh'
            
            try:
                lich = models.TM.objects.filter(loaidangky=loai_dk).first()
                
                if lich:
                    lich.batdau = start_datetime
                    lich.ketthuc = end_datetime
                    lich.save()
                else:
                    current_year = datetime.now().year
                    count = models.TM.objects.count() + 1
                    while True:
                        malich = f'L{current_year}{count:02d}'
                        if not models.TM.objects.filter(malich=malich).exists():
                            break
                        count += 1
                    models.TM.objects.create(
                        malich=malich,
                        loaidangky=loai_dk,
                        batdau=start_datetime,
                        ketthuc=end_datetime
                    )
                
                return JsonResponse({'status': 'success', 'data': {
                    'start_time': start_datetime,
                    'end_time': end_datetime
                }})
            
            except Exception as e:
                return JsonResponse({'status': 'error', 'message': str(e)})
                
        except ValueError:
            return JsonResponse({'status': 'error', 'message': 'Định dạng thời gian không hợp lệ'})
    register_timing = models.TM.objects.filter(loaidangky='dang_ky').first()
    enrollment_timing = models.TM.objects.filter(loaidangky='ghi_danh').first()
    
    try:
        
        context = {
            'timings': {
                'register': {
                    'start_time': register_timing.batdau if register_timing else None,
                    'end_time': register_timing.ketthuc if register_timing else None,
                },
                'enrollment': {
                    'start_time': enrollment_timing.batdau if enrollment_timing else None,
                    'end_time': enrollment_timing.ketthuc if enrollment_timing else None,
                }
            }
        }
        
        return render(request, 'pages/timing.html', context)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message':  ' ' + str(e)})

def author(request):
    role = phanquyen(request)
    if role != 'Admin':
        return JsonResponse({
            'status': 'error',
            'message': 'Không được phép truy cập'
        }, status=404)
    nv = models.TTNS.objects.all()
    sv = models.TTSV.objects.all()

    context = {
        'nv': nv,
        'sv': sv,
    }
    return render(request, 'pages/author.html', context)

def update_role(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data['userId']
            new_role = data['newRole']
            allowed_roles = ['Người dùng', 'Admin', 'Unknown']
            if new_role not in allowed_roles:
                return JsonResponse({'success': False, 'error': 'Vai trò không hợp lệ'})
            matk = get_object_or_404(models.TaiKhoan, matk=user_id)
            matk.vaitro = new_role
            matk.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Phương thức không hợp lệ'})

def phanquyen(request):
    matk = request.session.get('user_id')
    if not matk:
        return JsonResponse({
            'status': 'error',
            'message': 'Chưa đăng nhập'
        }, status=401)
    try:
        taikhoan = models.TaiKhoan.objects.get(matk=matk)
        return taikhoan.vaitro
    except models.TaiKhoan.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Tài khoản không tồn tại'
        }, status=401)
    
