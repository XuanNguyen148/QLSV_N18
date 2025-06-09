from django.db import models

class TaiKhoan(models.Model):
    matk = models.CharField(primary_key=True, max_length=9)
    matkhau = models.CharField(max_length=100)
    tendangnhap = models.CharField(max_length=50, unique=True)
    vaitro = models.CharField(max_length=20)

    class Meta:
        db_table = 'taikhoan'
        managed = False

    def __str__(self):
        return self.tendangnhap

class LHP(models.Model):
    malhp = models.CharField(primary_key=True, max_length=10)
    mahp = models.ForeignKey('HP', on_delete=models.SET_NULL, db_column='mahp', null=True, blank=True)
    giangvien = models.CharField(max_length=100, null=True, blank=True)
    sosvtoida = models.IntegerField(null=True, blank=True)
    lichhoc = models.TextField(null=True, blank=True)
    phonghoc = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'lophocphan'
        managed = False


class TTSV(models.Model):
    masv = models.CharField(primary_key=True, max_length=9)
    manganh = models.ForeignKey('NH', on_delete=models.SET_NULL, null=True, blank=True, db_column='manganh')
    matk = models.ForeignKey('TaiKhoan', on_delete=models.SET_NULL, null=True, blank=True, db_column='matk')
    hoten_sv = models.CharField(max_length=100)
    cccd_sv = models.CharField(max_length=12)
    lop = models.CharField(max_length=20)

    class Meta:
        db_table = 'sinhvien'
        managed = False

class TTNS(models.Model):
    manv = models.CharField(primary_key=True, max_length=9)
    matk = models.ForeignKey('TaiKhoan', on_delete=models.SET_NULL, null=True, blank=True, db_column='matk')
    hoten_nv = models.CharField(max_length=100)
    cccd_nv = models.CharField(max_length=12)

    class Meta:
        db_table = 'nhanvien'
        managed = False

class HP(models.Model):
    mahp = models.CharField(max_length=8, primary_key=True)
    tenhp = models.CharField(max_length=10)
    sotc = models.IntegerField()
    loai = models.CharField(max_length=20)
    hocky = models.IntegerField()
    manganh = models.ForeignKey('NH', on_delete=models.SET_NULL, null=True, blank=True, db_column='manganh')

    class Meta:
        db_table = 'hocphan'
        managed = False

class TTHT(models.Model):
    id = models.AutoField(primary_key=True)
    masv = models.ForeignKey('TTSV', on_delete=models.CASCADE, db_column='masv')
    mahp = models.ForeignKey('HP', on_delete=models.CASCADE, db_column='mahp')
    tinhtrang = models.CharField(max_length=20)

    class Meta:
        db_table = 'tinhtranghoctap'
        managed = False
        unique_together = (('masv', 'mahp'),)

class LS(models.Model):
    mals = models.CharField(primary_key=True, max_length=9)
    hoatdong = models.CharField(max_length=20)
    masv = models.ForeignKey('TTSV', on_delete=models.CASCADE, db_column='masv')
    mamh = models.CharField(max_length=10)
    trangthai = models.CharField(max_length=20)
    thoigian = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'lichsu'
        managed = False

class NH(models.Model):
    manganh = models.CharField(primary_key=True, max_length=4)
    tennganh = models.CharField(max_length=100)

    class Meta:
        db_table = 'nganhhoc'
        managed = False

class TTDK(models.Model):
    id = models.AutoField(primary_key=True)
    masv = models.ForeignKey('TTSV', on_delete=models.DO_NOTHING, db_column='masv')
    mamh = models.CharField(max_length=10)
    hoatdong = models.CharField(max_length=10)
    trangthai = models.CharField(max_length=20)
    mals = models.ForeignKey('LS', on_delete=models.DO_NOTHING, db_column='mals')

    class Meta:
        db_table = 'trangthaidk'
        managed = False

class TM(models.Model):
    malich = models.CharField(max_length=9, primary_key=True)
    batdau = models.DateTimeField()
    ketthuc = models.DateTimeField()
    loaidangky = models.CharField(max_length=20)

    class Meta:
        db_table = 'lichhen'
        managed = False