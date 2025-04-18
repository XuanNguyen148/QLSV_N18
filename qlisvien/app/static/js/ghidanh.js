function confirmRegistration() {
    const rows = document.querySelectorAll('.table-hocphan:nth-of-type(2) tbody tr'); // Lấy các dòng trong bảng "Kết quả đăng ký"
    const selectedCourses = [];

    rows.forEach((row) => {
        const course = {
            loai: row.children[1].textContent.trim(),
            mahp: row.children[2].textContent.trim(),
            tenhp: row.children[3].textContent.trim(),
            sotc: row.children[4].textContent.trim(),
        };
        selectedCourses.push(course);
    });

    // Hiển thị danh sách đã chọn trong console (hoặc xử lý khác nếu cần)
    console.log('Danh sách học phần đã chọn:', selectedCourses);
    alert('Danh sách học phần đã được xác nhận!');
}

function confirmRegistration() {
    // Hiển thị thông báo khi nhấn nút "Xác nhận"
    alert('Danh sách học phần đã được xác nhận!');
}