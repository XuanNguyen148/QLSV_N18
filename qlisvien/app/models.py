from django.db import models

class CustomUser(models.Model):
    id = models.CharField(max_length=10, db_column='matk', primary_key=True)
    username = models.CharField(max_length=30, db_column='tendangnhap')  # map với cột 'tendangnhap' trong DB
    password = models.CharField(max_length=255, db_column='matkhau')  # map với cột 'pass' trong DB

    # goi db
    class Meta:
        db_table = 'taikhoan'
        managed = False  # Django không quản lý bảng này

    # bình thường khi gọi class CustomUser sẽ chỉ hiện dạng <CustomUser: CustomUser object (1)>
    # nếu muốn hiển thị tên người dùng thì cần định nghĩa lại phương thức __str__
    # __str__ là phương thức trả về chuỗi đại diện cho đối tượng
    def __str__(self):
        return self.username

class Student(models.Model):
    id = models.CharField(max_length=10, db_column='masinhvien', primary_key=True)  # map với cột 'masinhvien' trong DB
    hoten = models.CharField(max_length=100)
    noio = models.CharField(max_length=255)
    diemhocphan = models.FloatField()
    lophocphan = models.CharField(max_length=50)


    class Meta:
        db_table = 'sinhvien'
        managed = False  # Django không quản lý bảng này
