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

document.addEventListener('DOMContentLoaded', function() {
    const btnsChon = document.querySelectorAll('#btn-chon');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    btnsChon.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const maHp = row.children[2].textContent;

            if (confirm('Bạn có chắc chắn muốn chọn học phần này?')) {
                fetch(`/them-hoc-phan/${maHp}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Thêm vào bảng kết quả đăng ký
                        const kqTable = document.querySelector('.table-hocphan:nth-of-type(2) tbody');
                        const newRow = document.createElement('tr');
                        const rowCount = kqTable.children.length;
                        
                        newRow.innerHTML = `
                            <td>${rowCount + 1}</td>
                            <td>${data.data.loai}</td>
                            <td>${data.data.mahp}</td>
                            <td>${data.data.tenhp}</td>
                            <td>${data.data.sotc}</td>
                            <td><button class="btn-action btn-huy" data-mahp="${data.data.mahp}">Hủy</button></td>
                        `;
                        kqTable.appendChild(newRow);
                        
                        // Thêm event listener cho nút hủy mới
                        const huyBtn = newRow.querySelector('.btn-huy');
                        addHuyEventListener(huyBtn);
                        
                        alert('Đã thêm học phần thành công');
                    } else {
                        alert(data.message || 'Có lỗi xảy ra khi thêm học phần');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Có lỗi xảy ra khi thêm học phần');
                });
            }
        });
    });
});

function addHuyEventListener(btn) {
    btn.addEventListener('click', function() {
        // ...existing code for delete functionality...
    });
}