# QLSV_N18

git checkout feature-branch -- abc.py
mv abc.py app/scripts/abc.py
git add app/scripts/abc.py
git commit -m

cp abc.py app/scripts/abc.py
git add app/scripts/abc.py
git commit -m "Thêm abc.py vào app/scripts/"

git push --set-upstream origin phu

CREATE DATABASE quanlydangkyhocphan;

-- Bảng sinh viên
CREATE TABLE SinhVien (
    MaSV VARCHAR(10) PRIMARY KEY,
    HoTen VARCHAR(50),
    SDT CHAR(10),
    NgaySinh DATE,
    NganhHoc VARCHAR(50),
    Lop VARCHAR(10)
);

-- Bảng tài khoản
CREATE TABLE TaiKhoan (
    MaTK VARCHAR(10) PRIMARY KEY,
    MaSV VARCHAR(10),
    MatKhau VARCHAR(255),
    TenDangNhap VARCHAR(30),
    Email VARCHAR(50),
    VaiTro VARCHAR(30),
    FOREIGN KEY (MaSV) REFERENCES SinhVien(MaSV)
);

-- Bảng học phần
CREATE TABLE HocPhan (
    MaHP VARCHAR(12) PRIMARY KEY,
    TenHP VARCHAR(50),
    SoTC INT
);

-- Bảng lớp học phần
CREATE TABLE LopHocPhan (
    MaLHP VARCHAR(15) PRIMARY KEY,
    MaHP VARCHAR(12),
    GiangVien VARCHAR(50),
    HocKy INT,
    SoSVToiDa INT,
    LichHoc VARCHAR(50),
    FOREIGN KEY (MaHP) REFERENCES HocPhan(MaHP)
);

-- Bảng chi tiết đăng ký
CREATE TABLE ChiTietDangKy (
    MaDK VARCHAR(10) PRIMARY KEY,
    MaSV VARCHAR(10),
    MaLHP VARCHAR(15),
    THOIGIAN DATE,
    TRANGTHAI VARCHAR(30),
    FOREIGN KEY (MaSV) REFERENCES SinhVien(MaSV),
    FOREIGN KEY (MaLHP) REFERENCES LopHocPhan(MaLHP)
);

-- Bảng kết quả ghi danh
create table kq_ghidanh
(
mahp varchar(15) primary key,
masv varchar(10),
tggd date,
thaotac varchar(4),
foreign key (mahp) references hocphan(mahp),
foreign key (masv) references sinhvien(masv)
);

INSERT INTO SinhVien (MaSV, HoTen, SDT, NgaySinh, NganhHoc, Lop)
VALUES 
('23D134567', 'Nguyễn Văn A', '0912345678', '2005-05-10', 'Hệ thống thông tin quản lý', 'K59S1'),
('23D123456', 'Lê Thị B', '0987654321', '2005-08-20', 'Kinh tế', 'K59F2'),
('23D145678', 'Vũ Thị C', '0913579845', '2005-06-20', 'Kinh tế', 'K59F3');


INSERT INTO TaiKhoan (MaTK, MaSV, MatKhau, TenDangNhap, Email, VaiTro)
VALUES 
('TK001', '23D134567', '123456', 'nguyenvana', 'vana@gmail.com', 'nguoi_dung'),
('TK002', '23D123456', 'abcdef', 'lethib', 'thib@gmail.com', 'nguoidung'),
('TK003', '23D145678', '654321', 'vuthic', 'thic@gmail.com', 'admin');

INSERT INTO HocPhan (MaHP, TenHP, SoTC)
VALUES 
('HP001', 'Cơ sở dữ liệu',3),
('HP002', 'Nguyên lý kế toán',3),
('HP003', 'Kinh tế lượng',3),
('HP004', 'Cơ sở dữ liệu',3),
('HP005', 'Nguyên lý kế toán',2),
('HP006', 'Kinh tế lượng',3);

INSERT INTO LopHocPhan (MaLHP, MaHP, GiangVien, HocKy, SoSVToiDa, LichHoc)
VALUES 
('LHP001', 'HP001', 'Trần Minh Tuấn', 1, 50, 'Thứ 2 - tiết 1,2,3'),
('LHP002', 'HP002', 'Ngô Thị Mai', 1, 40, 'Thứ 3 - tiết 4,5,6'),
('LHP003', 'HP003', 'Trần Anh Quang', 1, 60, 'Thứ 4 - tiết 7,8,9');


INSERT INTO ChiTietDangKy (MaDK, MaSV, MaLHP, THOIGIAN, TRANGTHAI)
VALUES 
('DK001', '23D134567', 'LHP001', '2024-12-24 16:37:30', 'Đăng ký'),
('DK002', '23D123456', 'LHP002', '2024-12-25 08:20:35', 'Đăng ký'),
('DK003', '23D145678', 'LHP003', '2024-12-25 08:00:40', 'Đăng ký');

****

####
