from . import models
from django.http import JsonResponse

def user_info(request):
    # Lấy mã tài khoản từ session
    matk = request.session.get('user_id')
    
    # Nếu không có matk, trả về context rỗng hoặc giá trị mặc định
    if not matk:
        return {
            'ten': None,
            'id': None,
            'tk': None,
            'is_authenticated': False
        }
    
    # Lấy thông tin người dùng
    sinh_vien = None
    try:
        sinh_vien = models.TTSV.objects.get(matk=matk)
        ten = sinh_vien.hoten_sv
        id = sinh_vien.masv
        tk = sinh_vien.matk
    except models.TTSV.DoesNotExist:
        try:
            sinh_vien = models.TTNS.objects.get(matk=matk)
            ten = sinh_vien.hoten_nv
            id = sinh_vien.manv
            tk = sinh_vien.matk
        except models.TTNS.DoesNotExist:
            # Nếu không tìm thấy người dùng, trả về giá trị mặc định
            return {
                'ten': None,
                'id': None,
                'tk': None,
                'is_authenticated': False
            }
    
    return {
        'ten': ten,
        'id': id,
        'tk': tk,
        'is_authenticated': True
    }

def phanquyen(request):
    # Lấy mã tài khoản từ session
    matk = request.session.get('user_id')
    if not matk:
        return {
            'is_admin': False,
            'is_sinhvien': False,
            'is_unknown': False,
        }
    # Lấy thông tin tài khoản nếu đã đăng nhập
    try:
        taikhoan = models.TaiKhoan.objects.get(matk=matk)
        return {
            'is_admin': taikhoan.vaitro == 'Admin',
            'is_sinhvien': taikhoan.vaitro == 'Người dùng',
            'is_unknown': taikhoan.vaitro == 'Unknown',
        }
    except models.TaiKhoan.DoesNotExist:
        return {
            'is_admin': False,
            'is_sinhvien': False,
            'is_unknown': False,
        }
    