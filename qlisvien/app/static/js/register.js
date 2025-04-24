document.addEventListener('DOMContentLoaded', function() {
    // Gắn sự kiện cho tất cả các nút "Đăng ký"
    document.querySelectorAll('.register-btn').forEach(button => {
        button.addEventListener('click', function() {
            const maHocPhan = this.dataset.maHocPhan; // Giả sử bạn có thuộc tính data-ma-hoc-phan trên nút
            showSelectClassForm(maHocPhan);
        });
    });
    
    // Gắn sự kiện cho các nút "Hủy" có sẵn trong trang
    attachCancelButtonEvents();
});

function showSelectClassForm(maHocPhan) {
    const container = document.getElementById('selectClassContainer');
    container.style.display = 'flex';

    // Lấy tbody của bảng chọn lớp học phần
    const tableBody = container.querySelector('tbody');
    
    // Xóa dữ liệu cũ
    tableBody.innerHTML = '';
    
    // Hiển thị loading state
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Đang tải...</td></tr>';
    
    // Gọi API để lấy danh sách lớp học phần
    fetch(`/api/lophocphan/?mahp=${maHocPhan}`)
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = ''; // Xóa loading state
            
            if (data && data.length > 0) {
                data.forEach((lhp, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${lhp.malhp}</td>
                        <td>${lhp.giangvien || 'Chưa phân công'}</td>
                        <td>${lhp.sosvtoida || 0}</td>
                        <td>${lhp.lichhoc || 'Chưa có lịch'}</td>
                        <td>${lhp.phonghoc || 'Chưa có phòng'}</td>
                        <td>
                            <button class="select-btn" 
                                    data-ma-lhp="${lhp.malhp}" 
                                    data-ma-hp="${maHocPhan}">
                                Đăng ký
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                
                // Gắn sự kiện cho các nút đăng ký mới
                attachSelectButtonEvents();
            } else {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center">
                            Không có lớp học phần nào cho mã học phần này
                        </td>
                    </tr>
                `;
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu lớp học phần:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        Đã xảy ra lỗi khi tải dữ liệu
                    </td>
                </tr>
            `;
        });
}

function attachSelectButtonEvents() {
    document.querySelectorAll('.select-btn').forEach(button => {
        button.addEventListener('click', function() {
            const maLHP = this.dataset.maLhp;
            const maHP = this.dataset.maHp;
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            // Gửi request đăng ký học phần
            fetch(`/dang-ky-hoc-phan/${maHP}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    malhp: maLHP
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Thêm vào bảng kết quả đăng ký
                    const resultTable = document.getElementById('result-table').querySelector('tbody');
                    const rowCount = resultTable.querySelectorAll('tr').length;
                    
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${rowCount + 1}</td>
                        <td>${data.data.mahp}</td>
                        <td>${data.data.tenhp}</td>
                        <td>${data.data.sotc}</td>
                        <td>${data.data.giangvien}</td>
                        <td>${data.data.phonghoc}</td>
                        <td>
                            <button class="cancel-btn" data-mahp="${data.data.mahp}">Hủy</button>
                            <button class="change-class-btn" onclick="showSelectClassForm('${data.data.mahp}')">Chuyển lớp</button>
                        </td>
                    `;
                    resultTable.appendChild(newRow);
                    
                    // Gắn sự kiện cho nút hủy mới
                    const cancelBtn = newRow.querySelector('.cancel-btn');
                    attachCancelButtonEvents();
                    
                    // Đóng form chọn lớp
                    hideSelectClassForm();
                    
                    alert('Đã đăng ký học phần thành công');
                } else {
                    alert(data.message || 'Có lỗi xảy ra khi đăng ký học phần');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi đăng ký học phần');
            });
        });
    });
}

function hideSelectClassForm() {
    const container = document.getElementById('selectClassContainer');
    container.style.display = 'none';
}

function attachCancelButtonEvents() {
    document.querySelectorAll('.cancel-btn').forEach(button => {
        button.addEventListener('click', function() {
            const maHP = this.dataset.mahp;
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            if (confirm('Bạn có chắc chắn muốn hủy học phần này?')) {
                fetch(`/xoa-hoc-phan/${maHP}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': csrfToken
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Xóa dòng khỏi bảng
                        const row = this.closest('tr');
                        row.parentNode.removeChild(row);
                        
                        // Cập nhật lại STT
                        const resultTable = document.getElementById('result-table').querySelector('tbody');
                        resultTable.querySelectorAll('tr').forEach((row, index) => {
                            row.children[0].textContent = index + 1;
                        });
                        
                        alert('Đã hủy học phần thành công');
                    } else {
                        alert('Có lỗi xảy ra khi hủy học phần');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Có lỗi xảy ra khi hủy học phần');
                });
            }
        });
    });
}

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