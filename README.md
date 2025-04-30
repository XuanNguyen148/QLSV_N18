# QLSV_N18

pip freeze > requirements.txt
pip install -r requirements.txt

git checkout feature-branch -- abc.py
mv abc.py app/scripts/abc.py
git add app/scripts/abc.py
git commit -m

cp abc.py app/scripts/abc.py
git add app/scripts/abc.py
git commit -m "Thêm abc.py vào app/scripts/"

git push --set-upstream origin phu

CREATE DATABASE qldkhp;

-- Sử dụng cơ sở dữ liệu vừa tạo
\c qldkhp;

-- Tạo bảng nganhhoc
CREATE TABLE nganhhoc (
    manganh VARCHAR(4) PRIMARY KEY,
    tennganh VARCHAR(100) NOT NULL
);

-- Tạo bảng taikhoan
CREATE TABLE taikhoan (
    matk VARCHAR(9) PRIMARY KEY,
    matkhau VARCHAR(100) NOT NULL,
    tendangnhap VARCHAR(50) NOT NULL UNIQUE,
    vaitro VARCHAR(20) NOT NULL 
);

– Tạo bảng sinh viên 
CREATE TABLE sinhvien (
    masv VARCHAR(9) PRIMARY KEY,
    manganh VARCHAR(4),
    matk VARCHAR(9),
    hoten_sv VARCHAR(100) NOT NULL,
    cccd_sv VARCHAR(12) NOT NULL,
    lop VARCHAR(20),
    FOREIGN KEY (manganh) REFERENCES nganhhoc(manganh),
    FOREIGN KEY (matk) REFERENCES taikhoan(matk)
);


-- Tạo bảng nhanvien
CREATE TABLE nhanvien (
    manv VARCHAR(9) PRIMARY KEY,
    matk VARCHAR(9),
    hoten_nv VARCHAR(100) NOT NULL,
    cccd_nv VARCHAR(12) NOT NULL,
    FOREIGN KEY (matk) REFERENCES taikhoan(matk)
);

-- Tạo bảng hocphan
CREATE TABLE hocphan (
    mahp VARCHAR(8) PRIMARY KEY,
    manganh VARCHAR(4),
    tenhp VARCHAR(100) NOT NULL,
    sotc INT NOT NULL,
    loai VARCHAR(20) NOT NULL,
    hocky INT NOT NULL,
    FOREIGN KEY (manganh) REFERENCES nganhhoc(manganh)
);

-- Tạo bảng lophocphan
CREATE TABLE lophocphan (
    malhp VARCHAR(10) PRIMARY KEY,
    mahp VARCHAR(8),
    manganh VARCHAR(4),
    giangvien VARCHAR(100),
    sosvtoida INT,
    lichhoc TEXT,
    phonghoc varchar(50),    
    FOREIGN KEY (manganh) REFERENCES nganhhoc(manganh),
    FOREIGN KEY (mahp) REFERENCES hocphan(mahp)
);

-- thêm cột id định dạng serial
-- Tạo bảng tinhtranghoctap
CREATE TABLE tinhtranghoctap (
    id serial PRIMARY KEY,
    masv VARCHAR(9),
    mahp VARCHAR(8),
    tinhtrang VARCHAR(20),
    FOREIGN KEY (masv) REFERENCES sinhvien(masv),
    FOREIGN KEY (mahp) REFERENCES hocphan(mahp)
);

CREATE TABLE lichsu (
    mals VARCHAR(9) PRIMARY KEY,
    hoatdong VARCHAR(20) NOT NULL,         -- 'ghidanh' hoặc 'dangky'
    masv VARCHAR(9) NOT NULL,
    mahp VARCHAR(8),                       -- luôn cần với ghi danh, và cũng dùng được cho đăng ký
    malhp VARCHAR(10),                     -- chỉ dùng cho đăng ký
    trangthai VARCHAR(20),
    thoigian TIMESTAMP,
    FOREIGN KEY (masv) REFERENCES sinhvien(masv),
    FOREIGN KEY (mahp) REFERENCES hocphan(mahp),
    FOREIGN KEY (malhp) REFERENCES lophocphan(malhp)
);

-- Tạo bảng lichhen
CREATE TABLE lichhen (
    malich VARCHAR(9) PRIMARY KEY,
    loaidangky VARCHAR(20),
    namhoc INT,
    hocky INT,
    batdau TIMESTAMP,
    ketthuc TIMESTAMP
);


INSERT INTO nganhhoc (manganh, tennganh) VALUES ('TM22', 'Hệ thống thông tin quản lý (Quản trị hệ thống thông tin)');
INSERT INTO nganhhoc (manganh, tennganh) VALUES ('TM14', 'Kế toán (Kế toán công)');

INSERT INTO taikhoan (matk, matkhau, tendangnhap, vaitro) VALUES ('TK0000001', '001305991173', '23D190001', 'Người dùng');
INSERT INTO taikhoan (matk, matkhau, tendangnhap, vaitro) VALUES ('TK0000002', '001305874562', '23D190002', 'Người dùng');
INSERT INTO taikhoan (matk, matkhau, tendangnhap, vaitro) VALUES ('TK0000003', '001305112398', '23D190003', 'Người dùng');
INSERT INTO taikhoan (matk, matkhau, tendangnhap, vaitro) VALUES ('TK0000004', '001305746290', '23D190004', 'Người dùng');
INSERT INTO taikhoan (matk, matkhau, tendangnhap, vaitro) VALUES ('TK0000005', '001305334821', '23D190005', 'Người dùng');
INSERT INTO taikhoan (matk, matkhau, tendangnhap, vaitro) VALUES ('TK0000006', '001305998134', '23D190006', 'Người dùng');
INSERT INTO taikhoan (matk, matkhau, tendangnhap, vaitro) VALUES ('TK0000007', '001305998143', 'NV0000001', 'Admin');

INSERT INTO sinhvien (masv, manganh, matk, hoten_sv, cccd_sv, lop) VALUES ('24D190001', 'TM22', 'TK0000001', 'Nguyễn Thùy Linh', '001305991173', 'K60S1');
INSERT INTO sinhvien (masv, manganh, matk, hoten_sv, cccd_sv, lop) VALUES ('23D190002', 'TM22', 'TK0000002', 'Trần Minh Hoàng', '001305874562', 'K59S1');
INSERT INTO sinhvien (masv, manganh, matk, hoten_sv, cccd_sv, lop) VALUES ('22D190003', 'TM22', 'TK0000003', 'Lê Ngọc Anh', '001305112398', 'K58S1');
INSERT INTO sinhvien (masv, manganh, matk, hoten_sv, cccd_sv, lop) VALUES ('24D190004', 'TM14', 'TK0000004', 'Phạm Quốc Bảo', '001305746290', 'K60E1');
INSERT INTO sinhvien (masv, manganh, matk, hoten_sv, cccd_sv, lop) VALUES ('23D190005', 'TM14', 'TK0000005', 'Võ Thị Mai Hương', '001305334821', 'K59E1');
INSERT INTO sinhvien (masv, manganh, matk, hoten_sv, cccd_sv, lop) VALUES ('22D190006', 'TM14', 'TK0000006', 'Đặng Văn Kiệt', '001305998134', 'K58E1');

INSERT INTO nhanvien (manv, hoten_nv, cccd_nv, matk) VALUES ('NV0000001', 'Nguyễn Linh Anh', '001305998143', 'TK0000007');

INSERT INTO hocphan (mahp, manganh, tenhp, sotc, loai, hocky) VALUES
('AMAT1011', 'TM22', 'Toán đại cương', 3, 'Bắt buộc', 2),
('ENTH1411', 'TM22', 'Tiếng Anh 1', 2, 'Bắt buộc', 2),
('GDTC1611', 'TM22', 'Giáo dục thể chất chung', 1, 'Bắt buộc', 2),
('INFO2311', 'TM22', 'Cơ sở dữ liệu', 2, 'Bắt buộc', 2),
('MLNP0221', 'TM22', 'Triết học Mác - Lênin', 3, 'Bắt buộc', 2),
('TLAW0111', 'TM22', 'Pháp luật đại cương', 2, 'Bắt buộc', 2),
('RLCP0421', 'TM22', 'Xã hội học đại cương', 2, 'Tự chọn', 2),
('TECO0111', 'TM22', 'Kinh tế thương mại đại cương', 2, 'Tự chọn', 2),
('BMGM0111', 'TM22', 'Quản trị học', 3, 'Bắt buộc', 3),
('ENTH1511', 'TM22', 'Tiếng Anh 2', 2, 'Bắt buộc', 3),
('MIEC0821', 'TM22', 'Kinh tế học', 3, 'Bắt buộc', 3),
('PCOM0111', 'TM22', 'Thương mại điện tử căn bản', 3, 'Bắt buộc', 3),
('BMKT3811', 'TM22', 'Hành vi khách hàng', 3, 'Tự chọn', 3),
('ECIT2321', 'TM22', 'Cơ sở toán học cho tin học', 3, 'Tự chọn', 3),
('GDTC0521', 'TM22', 'Cầu lông', 1, 'Tự chọn', 3),
('GDTC0721', 'TM22', 'Bóng ném', 1, 'Tự chọn', 3),
('INFO3411', 'TM22', 'Các hệ thống thông tin và quy trình kinh doanh', 2, 'Tự chọn', 3),
('INFO4111', 'TM22', 'Lập trình hướng đối tượng', 2, 'Tự chọn', 3),
('ECIT2421', 'TM22', 'Mạng máy tính và truyền thông', 2, 'Bắt buộc', 4),
('eCIT2611', 'TM22', 'Phân tích nghiệp vụ phần mềm', 3, 'Bắt buộc', 4),
('ECIT2621', 'TM22', 'Phát triển hệ thống thông tin kinh tế', 3, 'Bắt buộc', 4),
('ENTH1611', 'TM22', 'Tiếng Anh 3', 2, 'Bắt buộc', 4),
('RLCP1211', 'TM22', 'Kinh tế chính trị Mác - Lênin', 2, 'Bắt buộc', 4),
('AMAT0411', 'TM22', 'Kinh tế lượng', 3, 'Tự chọn', 4),
('CEMG4111', 'TM22', 'Khởi sự kinh doanh', 2, 'Tự chọn', 4),
('INFO1311', 'TM22', 'Cấu trúc dữ liệu và giải thuật', 3, 'Tự chọn', 4),
('PCOM1111', 'TM22', 'Chuyển đổi số trong kinh doanh', 2, 'Tự chọn', 4),
('PHIL1011', 'TM14', 'Triết học Mác - Lênin', 3, 'Bắt buộc', 2),
('ECON1011', 'TM14', 'Kinh tế vi mô', 3, 'Bắt buộc', 2),
('STAT1011', 'TM14', 'Thống kê kinh doanh', 3, 'Bắt buộc', 2),
('ENGL1011', 'TM14', 'Tiếng Anh 1', 2, 'Bắt buộc', 2),
('LAWS1011', 'TM14', 'Pháp luật đại cương', 2, 'Bắt buộc', 2),
('ENTR1011', 'TM14', 'Khởi nghiệp kinh doanh', 3, 'Tự chọn', 2),
('LANG1011', 'TM14', 'Kỹ năng giao tiếp và thuyết trình', 2, 'Tự chọn', 2),
('ECON1012', 'TM14', 'Kinh tế vĩ mô', 3, 'Bắt buộc', 3),
('ACCT1021', 'TM14', 'Kế toán tài chính 1', 3, 'Bắt buộc', 3),
('MKTG1011', 'TM14', 'Marketing căn bản', 2, 'Bắt buộc', 3),
('ENGL1012', 'TM14', 'Tiếng Anh 2', 2, 'Bắt buộc', 3),
('ACCT1041', 'TM14', 'Kế toán doanh nghiệp nhỏ và vừa', 3, 'Tự chọn', 3),
('MGMT1041', 'TM14', 'Văn hóa doanh nghiệp', 2, 'Tự chọn', 3),
('PSYC1011', 'TM14', 'Tâm lý học đại cương', 2, 'Tự chọn', 3),
('ECOE1011', 'TM14', 'Kinh tế môi trường', 3, 'Tự chọn', 3),
('ACCT1051', 'TM14', 'Kế toán công', 3, 'Tự chọn', 3),
('MGMT1021', 'TM14', 'Quản trị tài chính căn bản', 3, 'Bắt buộc', 4),
('ACCT1031', 'TM14', 'Kế toán tài chính 2', 3, 'Bắt buộc', 4),
('TAXS1011', 'TM14', 'Pháp luật và nghiệp vụ thuế', 3, 'Bắt buộc', 4),
('ENGL1013', 'TM14', 'Tiếng Anh 3', 2, 'Bắt buộc', 4),
('MGMT1031', 'TM14', 'Quản trị doanh nghiệp', 2, 'Bắt buộc', 4),
('TECH1011', 'TM14', 'Ứng dụng công nghệ trong kế toán', 2, 'Tự chọn', 4),
('INNO1011', 'TM14', 'Tư duy sáng tạo và đổi mới trong kinh doanh', 2, 'Tự chọn', 4),
('MGMT1061', 'TM14', 'Quản trị nhân sự', 3, 'Tự chọn', 4);

INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('AMAT1011_1', 'AMAT1011', 'Nguyễn Văn An', 100, 'Thứ 2 - Ca 1', 'V404');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('AMAT1011_2', 'AMAT1011', 'Trần Thị Bình', 100, 'Thứ 2 - Ca 2', 'V501');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('ENTH1411_1', 'ENTH1411', 'Lê Hoàng Cường', 100, 'Thứ 2 - Ca 3', 'P1006');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('ENTH1411_2', 'ENTH1411', 'Phạm Thị Duyên', 100, 'Thứ 2 - Ca 4', 'V408');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('GDTC1611_1', 'GDTC1611', 'Đỗ Văn Đức', 100, 'Thứ 3 - Ca 1', 'P1006');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('GDTC1611_2', 'GDTC1611', 'Vũ Thị Hạnh', 100, 'Thứ 3 - Ca 2', 'G309');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('INFO2311_1', 'INFO2311', 'Bùi Minh Khang', 100, 'Thứ 3 - Ca 3', 'V507');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('INFO2311_2', 'INFO2311', 'Nguyễn Thị Lan', 100, 'Thứ 3 - Ca 4', 'P908');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('MLNP0221_1', 'MLNP0221', 'Trần Văn Nam', 100, 'Thứ 4 - Ca 1', 'P1004');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('MLNP0221_2', 'MLNP0221', 'Hoàng Thị Oanh', 100, 'Thứ 4 - Ca 2', 'P905');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('TLAW0111_1', 'TLAW0111', 'Nguyễn Văn An', 100, 'Thứ 4 - Ca 3', 'G202');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('TLAW0111_2', 'TLAW0111', 'Trần Thị Bình', 100, 'Thứ 4 - Ca 4', 'V305');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('RLCP0421_1', 'RLCP0421', 'Lê Hoàng Cường', 100, 'Thứ 5 - Ca 1', 'V108');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('RLCP0421_2', 'RLCP0421', 'Phạm Thị Duyên', 100, 'Thứ 5 - Ca 2', 'V504');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('TECO0111_1', 'TECO0111', 'Đỗ Văn Đức', 100, 'Thứ 5 - Ca 3', 'G309');
INSERT INTO lophocphan (malhp, mahp, giangvien, sosvtoida, lichhoc, phonghoc) VALUES ('TECO0111_2', 'TECO0111', 'Vũ Thị Hạnh', 100, 'Thứ 5 - Ca 4', 'G103');
INSERT INTO lophocphan VALUES ('BMGM0111_1', 'BMGM0111', 'Nguyễn Văn An', 100, 'Thứ 2 - Ca 1', 'V302');
INSERT INTO lophocphan VALUES ('BMGM0111_2', 'BMGM0111', 'Trần Thị Bình', 100, 'Thứ 2 - Ca 2', 'P702');
INSERT INTO lophocphan VALUES ('ENTH1511_1', 'ENTH1511', 'Lê Hoàng Cường', 100, 'Thứ 2 - Ca 3', 'P705');
INSERT INTO lophocphan VALUES ('ENTH1511_2', 'ENTH1511', 'Phạm Thị Duyên', 100, 'Thứ 2 - Ca 4', 'G101');
INSERT INTO lophocphan VALUES ('MIEC0821_1', 'MIEC0821', 'Đỗ Văn Đức', 100, 'Thứ 3 - Ca 1', 'V203');
INSERT INTO lophocphan VALUES ('MIEC0821_2', 'MIEC0821', 'Vũ Thị Hạnh', 100, 'Thứ 3 - Ca 2', 'P803');
INSERT INTO lophocphan VALUES ('PCOM0111_1', 'PCOM0111', 'Bùi Minh Khang', 100, 'Thứ 3 - Ca 3', 'G201');
INSERT INTO lophocphan VALUES ('PCOM0111_2', 'PCOM0111', 'Nguyễn Thị Lan', 100, 'Thứ 3 - Ca 4', 'V102');
INSERT INTO lophocphan VALUES ('BMKT3811_1', 'BMKT3811', 'Trần Văn Nam', 100, 'Thứ 4 - Ca 1', 'P909');
INSERT INTO lophocphan VALUES ('BMKT3811_2', 'BMKT3811', 'Hoàng Thị Oanh', 100, 'Thứ 4 - Ca 2', 'G303');
INSERT INTO lophocphan VALUES ('ECIT2321_1', 'ECIT2321', 'Nguyễn Văn An', 100, 'Thứ 4 - Ca 3', 'V305');
INSERT INTO lophocphan VALUES ('ECIT2321_2', 'ECIT2321', 'Trần Thị Bình', 100, 'Thứ 4 - Ca 4', 'P701');
INSERT INTO lophocphan VALUES ('GDTC0521_1', 'GDTC0521', 'Lê Hoàng Cường', 100, 'Thứ 5 - Ca 1', 'V401');
INSERT INTO lophocphan VALUES ('GDTC0521_2', 'GDTC0521', 'Phạm Thị Duyên', 100, 'Thứ 5 - Ca 2', 'G102');
INSERT INTO lophocphan VALUES ('GDTC0721_1', 'GDTC0721', 'Đỗ Văn Đức', 100, 'Thứ 5 - Ca 3', 'P706');
INSERT INTO lophocphan VALUES ('GDTC0721_2', 'GDTC0721', 'Vũ Thị Hạnh', 100, 'Thứ 5 - Ca 4', 'V207');
INSERT INTO lophocphan VALUES ('INFO3411_1', 'INFO3411', 'Nguyễn Văn An', 100, 'Thứ 2 - Ca 1', 'G203');
INSERT INTO lophocphan VALUES ('INFO3411_2', 'INFO3411', 'Trần Thị Bình', 100, 'Thứ 2 - Ca 2', 'V402');
INSERT INTO lophocphan VALUES ('INFO4111_1', 'INFO4111', 'Lê Hoàng Cường', 100, 'Thứ 2 - Ca 3', 'P805');
INSERT INTO lophocphan VALUES ('INFO4111_2', 'INFO4111', 'Phạm Thị Duyên', 100, 'Thứ 2 - Ca 4', 'V506');
INSERT INTO lophocphan VALUES ('ECIT2421_1', 'ECIT2421', 'Đỗ Văn Đức', 100, 'Thứ 3 - Ca 1', 'G301');
INSERT INTO lophocphan VALUES ('ECIT2421_2', 'ECIT2421', 'Vũ Thị Hạnh', 100, 'Thứ 3 - Ca 2', 'P603');
INSERT INTO lophocphan VALUES ('eCIT2611_1', 'eCIT2611', 'Bùi Minh Khang', 100, 'Thứ 3 - Ca 3', 'V109');
INSERT INTO lophocphan VALUES ('eCIT2611_2', 'eCIT2611', 'Nguyễn Thị Lan', 100, 'Thứ 3 - Ca 4', 'G102');
INSERT INTO lophocphan VALUES ('ECIT2621_1', 'ECIT2621', 'Trần Văn Nam', 100, 'Thứ 4 - Ca 1', 'P1003');
INSERT INTO lophocphan VALUES ('ECIT2621_2', 'ECIT2621', 'Hoàng Thị Oanh', 100, 'Thứ 4 - Ca 2', 'V308');
INSERT INTO lophocphan VALUES ('ENTH1611_1', 'ENTH1611', 'Nguyễn Văn An', 100, 'Thứ 4 - Ca 3', 'P706');
INSERT INTO lophocphan VALUES ('ENTH1611_2', 'ENTH1611', 'Trần Thị Bình', 100, 'Thứ 4 - Ca 4', 'G105');
INSERT INTO lophocphan VALUES ('RLCP1211_1', 'RLCP1211', 'Lê Hoàng Cường', 100, 'Thứ 5 - Ca 1', 'V504');
INSERT INTO lophocphan VALUES ('RLCP1211_2', 'RLCP1211', 'Phạm Thị Duyên', 100, 'Thứ 5 - Ca 2', 'P806');
INSERT INTO lophocphan VALUES ('AMAT0411_1', 'AMAT0411', 'Đỗ Văn Đức', 100, 'Thứ 5 - Ca 3', 'G203');
INSERT INTO lophocphan VALUES ('AMAT0411_2', 'AMAT0411', 'Vũ Thị Hạnh', 100, 'Thứ 5 - Ca 4', 'P805');
INSERT INTO lophocphan VALUES ('CEMG4111_1', 'CEMG4111', 'Nguyễn Văn An', 100, 'Thứ 2 - Ca 1', 'V106');
INSERT INTO lophocphan VALUES ('CEMG4111_2', 'CEMG4111', 'Trần Thị Bình', 100, 'Thứ 2 - Ca 2', 'P906');
INSERT INTO lophocphan VALUES ('INFO1311_1', 'INFO1311', 'Lê Hoàng Cường', 100, 'Thứ 2 - Ca 3', 'G207');
INSERT INTO lophocphan VALUES ('INFO1311_2', 'INFO1311', 'Phạm Thị Duyên', 100, 'Thứ 2 - Ca 4', 'V204');
INSERT INTO lophocphan VALUES ('PCOM1111_1', 'PCOM1111', 'Đỗ Văn Đức', 100, 'Thứ 3 - Ca 1', 'P709');
INSERT INTO lophocphan VALUES ('PCOM1111_2', 'PCOM1111', 'Vũ Thị Hạnh', 100, 'Thứ 3 - Ca 2', 'G302');
INSERT INTO lophocphan VALUES ('PHIL1011_1', 'PHIL1011', 'Tạ Minh Quân', 100, 'Thứ 3 - Ca 3', 'P707');
INSERT INTO lophocphan VALUES ('PHIL1011_2', 'PHIL1011', 'Hà Thị Nhung', 100, 'Thứ 3 - Ca 4', 'V101');
INSERT INTO lophocphan VALUES ('ECON1011_1', 'ECON1011', 'Lương Gia Bảo', 100, 'Thứ 4 - Ca 1', 'P908');
INSERT INTO lophocphan VALUES ('ECON1011_2', 'ECON1011', 'Chu Thị Kim Ngân', 100, 'Thứ 4 - Ca 2', 'G208');
INSERT INTO lophocphan VALUES ('STAT1011_1', 'STAT1011', 'Nguyễn Đình Phú', 100, 'Thứ 4 - Ca 3', 'V406');
INSERT INTO lophocphan VALUES ('STAT1011_2', 'STAT1011', 'Mai Thị Thu Hà', 100, 'Thứ 4 - Ca 4', 'P804');
INSERT INTO lophocphan VALUES ('ENGL1011_1', 'ENGL1011', 'Trịnh Quốc Huy', 100, 'Thứ 5 - Ca 1', 'V205');
INSERT INTO lophocphan VALUES ('ENGL1011_2', 'ENGL1011', 'Dương Thị Hòa', 100, 'Thứ 5 - Ca 2', 'G306');
INSERT INTO lophocphan VALUES ('LAWS1011_1', 'LAWS1011', 'Tạ Minh Quân', 100, 'Thứ 2 - Ca 1', 'G207');
INSERT INTO lophocphan VALUES ('LAWS1011_2', 'LAWS1011', 'Hà Thị Nhung', 100, 'Thứ 2 - Ca 2', 'P707');
INSERT INTO lophocphan VALUES ('ENTR1011_1', 'ENTR1011', 'Lương Gia Bảo', 100, 'Thứ 2 - Ca 3', 'V107');
INSERT INTO lophocphan VALUES ('ENTR1011_2', 'ENTR1011', 'Chu Thị Kim Ngân', 100, 'Thứ 2 - Ca 4', 'G105');
INSERT INTO lophocphan VALUES ('LANG1011_1', 'LANG1011', 'Nguyễn Đình Phú', 100, 'Thứ 3 - Ca 1', 'P803');
INSERT INTO lophocphan VALUES ('LANG1011_2', 'LANG1011', 'Mai Thị Thu Hà', 100, 'Thứ 3 - Ca 2', 'V307');
INSERT INTO lophocphan VALUES ('ECON1012_1', 'ECON1012', 'Trịnh Quốc Huy', 100, 'Thứ 3 - Ca 3', 'G201');
INSERT INTO lophocphan VALUES ('ECON1012_2', 'ECON1012', 'Dương Thị Hòa', 100, 'Thứ 3 - Ca 4', 'P606');
INSERT INTO lophocphan VALUES ('ACCT1021_1', 'ACCT1021', 'Kiều Văn Khánh', 100, 'Thứ 4 - Ca 1', 'G305');
INSERT INTO lophocphan VALUES ('ACCT1021_2', 'ACCT1021', 'Đặng Thị Yến Nhi', 100, 'Thứ 4 - Ca 2', 'P705');
INSERT INTO lophocphan VALUES ('MKTG1011_1', 'MKTG1011', 'Tạ Minh Quân', 100, 'Thứ 4 - Ca 3', 'V403');
INSERT INTO lophocphan VALUES ('MKTG1011_2', 'MKTG1011', 'Hà Thị Nhung', 100, 'Thứ 4 - Ca 4', 'P701');
INSERT INTO lophocphan VALUES ('ENGL1012_1', 'ENGL1012', 'Lương Gia Bảo', 100, 'Thứ 5 - Ca 1', 'V202');
INSERT INTO lophocphan VALUES ('ENGL1012_2', 'ENGL1012', 'Chu Thị Kim Ngân', 100, 'Thứ 5 - Ca 2', 'P603');
INSERT INTO lophocphan VALUES ('ACCT1041_1', 'ACCT1041', 'Nguyễn Đình Phú', 100, 'Thứ 5 - Ca 3', 'G104');
INSERT INTO lophocphan VALUES ('ACCT1041_2', 'ACCT1041', 'Mai Thị Thu Hà', 100, 'Thứ 5 - Ca 4', 'V103');
INSERT INTO lophocphan VALUES ('MGMT1041_1', 'MGMT1041', 'Trịnh Quốc Huy', 100, 'Thứ 2 - Ca 1', 'G302');
INSERT INTO lophocphan VALUES ('PSYC1011_1', 'PSYC1011', 'Dương Thị Hòa', 100, 'Thứ 2 - Ca 2', 'V408');
INSERT INTO lophocphan VALUES ('PSYC1011_2', 'PSYC1011', 'Kiều Văn Khánh', 100, 'Thứ 2 - Ca 3', 'P806');
INSERT INTO lophocphan VALUES ('ECOE1011_1', 'ECOE1011', 'Đặng Thị Yến Nhi', 100, 'Thứ 2 - Ca 4', 'P804');
INSERT INTO lophocphan VALUES ('ECOE1011_2', 'ECOE1011', 'Tạ Minh Quân', 100, 'Thứ 3 - Ca 1', 'V301');
INSERT INTO lophocphan VALUES ('ACCT1051_1', 'ACCT1051', 'Hà Thị Nhung', 100, 'Thứ 3 - Ca 2', 'P905');
INSERT INTO lophocphan VALUES ('ACCT1051_2', 'ACCT1051', 'Lương Gia Bảo', 100, 'Thứ 3 - Ca 3', 'G307');
INSERT INTO lophocphan VALUES ('MGMT1021_1', 'MGMT1021', 'Chu Thị Kim Ngân', 100, 'Thứ 3 - Ca 4', 'V204');
INSERT INTO lophocphan VALUES ('MGMT1021_2', 'MGMT1021', 'Nguyễn Đình Phú', 100, 'Thứ 4 - Ca 1', 'P703');
INSERT INTO lophocphan VALUES ('ACCT1031_1', 'ACCT1031', 'Mai Thị Thu Hà', 100, 'Thứ 4 - Ca 2', 'V408');
INSERT INTO lophocphan VALUES ('ACCT1031_2', 'ACCT1031', 'Trịnh Quốc Huy', 100, 'Thứ 4 - Ca 3', 'G203');
INSERT INTO lophocphan VALUES ('TAXS1011_1', 'TAXS1011', 'Dương Thị Hòa', 100, 'Thứ 4 - Ca 4', 'P706');
INSERT INTO lophocphan VALUES ('TAXS1011_2', 'TAXS1011', 'Kiều Văn Khánh', 100, 'Thứ 5 - Ca 1', 'V405');
INSERT INTO lophocphan VALUES ('ENGL1013_1', 'ENGL1013', 'Đặng Thị Yến Nhi', 100, 'Thứ 5 - Ca 2', 'P903');
INSERT INTO lophocphan VALUES ('ENGL1013_2', 'ENGL1013', 'Tạ Minh Quân', 100, 'Thứ 5 - Ca 3', 'G106');
INSERT INTO lophocphan VALUES ('MGMT1031_1', 'MGMT1031', 'Hà Thị Nhung', 100, 'Thứ 5 - Ca 4', 'V203');
INSERT INTO lophocphan VALUES ('MGMT1031_2', 'MGMT1031', 'Lương Gia Bảo', 100, 'Thứ 2 - Ca 1', 'P1004');
INSERT INTO lophocphan VALUES ('TECH1011_1', 'TECH1011', 'Chu Thị Kim Ngân', 100, 'Thứ 2 - Ca 2', 'V302');
INSERT INTO lophocphan VALUES ('TECH1011_2', 'TECH1011', 'Nguyễn Đình Phú', 100, 'Thứ 2 - Ca 3', 'P707');
INSERT INTO lophocphan VALUES ('INNO1011_1', 'INNO1011', 'Mai Thị Thu Hà', 100, 'Thứ 2 - Ca 4', 'G204');
INSERT INTO lophocphan VALUES ('INNO1011_2', 'INNO1011', 'Trịnh Quốc Huy', 100, 'Thứ 3 - Ca 1', 'P705');
INSERT INTO lophocphan VALUES ('MGMT1061_1', 'MGMT1061', 'Dương Thị Hòa', 100, 'Thứ 3 - Ca 2', 'V109');
INSERT INTO lophocphan VALUES ('MGMT1061_2', 'MGMT1061', 'Kiều Văn Khánh', 100, 'Thứ 3 - Ca 3', 'G209');

####

-- Thêm dữ liệu cho sinh viên 24D190001 (K60S1)
INSERT INTO tinhtranghoctap (masv, mahp, tinhtrang) VALUES
    ('24D190001', 'MLNP0221', 'Qua môn'),     -- Triết học Mác-Lênin (BB)
    ('24D190001', 'TLAW0111', 'Qua môn'),     -- Pháp luật đại cương (BB)
    ('24D190001', 'RLCP0421', 'Qua môn'),     -- Xã hội học đại cương (TC)
    ('24D190001', 'TECO0111', 'Không qua');   -- Kinh tế thương mại đại cương (TC)

-- Thêm dữ liệu cho sinh viên 23D190002 (K59S1)
INSERT INTO tinhtranghoctap (masv, mahp, tinhtrang) VALUES
    ('23D190002', 'AMAT1011', 'Qua môn'),     -- Toán đại cương (BB)
    ('23D190002', 'ENTH1411', 'Qua môn'),     -- Tiếng Anh 1 (BB)
    ('23D190002', 'GDTC1611', 'Qua môn'),     -- GDTC chung (BB)
    ('23D190002', 'INFO2311', 'Không qua'),   -- Cơ sở dữ liệu (BB)
    ('23D190002', 'TECO0111', 'Qua môn'),     -- Kinh tế thương mại đại cương (TC)
    ('23D190002', 'BMKT3811', 'Qua môn');     -- Hành vi khách hàng (TC)

-- Thêm dữ liệu cho sinh viên 24D190004 (K60E1)
INSERT INTO tinhtranghoctap (masv, mahp, tinhtrang) VALUES
    ('24D190004', 'PHIL1011', 'Qua môn'),     -- Triết học Mác-Lênin (BB)
    ('24D190004', 'ECON1011', 'Không qua'),   -- Kinh tế vi mô (BB)
    ('24D190004', 'ENTR1011', 'Qua môn'),     -- Khởi nghiệp kinh doanh (TC)
    ('24D190004', 'LANG1011', 'Qua môn');     -- Kỹ năng giao tiếp (TC)

-- Thêm dữ liệu lịch sử
INSERT INTO lichsu (mals, hoatdong, masv, mahp, malhp, trangthai, thoigian) VALUES
('LS0000001', 'Ghi danh', '24D190001', 'ACCT1021', 'ACCT1051_1', 'Thanh cong', '2025-04-24 10:00:00'),
('LS0000002', 'Ghi danh', '24D190001', 'ACCT1021', 'ACCT1051_2', 'That bai', '2025-04-24 11:00:00'),
('LS0000003', 'Ghi danh', '24D190001', 'ACCT1051', 'ACCT1051_1', 'Dang cho', '2025-04-24 12:00:00');
