document.addEventListener('DOMContentLoaded', function() {
    // Gắn sự kiện cho tất cả các nút "Đăng ký"
    document.querySelectorAll('.register-btn').forEach(button => {
        button.addEventListener('click', function() {
            const maHocPhan = this.dataset.maHocPhan; // Giả sử bạn có thuộc tính data-ma-hoc-phan trên nút
            showSelectClassForm(maHocPhan);
        });
    });
});

function showSelectClassForm(maHocPhan) {
    const container = document.getElementById('selectClassContainer');
    container.style.display = 'flex';

    // Hiển thị thông tin các lớp học phần tương ứng
    console.log(`Hiển thị các lớp học phần cho mã học phần: ${maHocPhan}`);
    // Bạn có thể thêm logic để tải dữ liệu lớp học phần từ backend nếu cần
}

function hideSelectClassForm() {
    const container = document.getElementById('selectClassContainer');
    container.style.display = 'none';
}

// Xử lý khi nhấn nút Đăng ký trong form chọn lớp
document.querySelectorAll('.select-btn').forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        const lopHP = row.children[1].textContent;
        const giangVien = row.children[2].textContent;
        
        alert(`Đã đăng ký lớp học phần ${lopHP} với giảng viên ${giangVien}`);
        hideSelectClassForm();
    });
});

function confirmRegistration() {
    const rows = document.querySelectorAll('.table-hocphan tbody tr'); // Lấy các dòng trong bảng
    const selectedCourses = [];

    rows.forEach((row) => {
        const course = {
            mahp: row.children[1].textContent.trim(),
            tenhp: row.children[2].textContent.trim(),
            sotc: row.children[3].textContent.trim(),
        };
        selectedCourses.push(course);
    });

    // Hiển thị danh sách đã chọn trong console (hoặc xử lý khác nếu cần)
    console.log('Danh sách học phần đã chọn:', selectedCourses);
    alert('Danh sách học phần đã được xác nhận!');
}

