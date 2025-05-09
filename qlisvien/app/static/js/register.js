function showSelectClassForm(maHocPhan) {
    const container = document.getElementById('selectClassContainer');
    container.style.display = 'flex';

    // Lấy tbody của bảng chọn lớp học phần
    const tableBody = container.querySelector('tbody');
    
    // Xóa dữ liệu cũ
    tableBody.innerHTML = '';
    
    // Hiển thị loading state
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Đang tải...</td></tr>';

    // Lấy CSRF token
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (!csrfToken) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Lỗi: Không tìm thấy CSRF token</td></tr>';
        return;
    }

    // Gọi API để lấy danh sách lớp học phần theo mã học phần
    fetch(`/get_lophocphan/?mahp=${maHocPhan}`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi khi tải danh sách lớp học phần');
        }
        return response.json();
    })
    .then(data => {
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Không có lớp học phần nào cho học phần này</td></tr>';
            return;
        }

        // Xóa loading state
        tableBody.innerHTML = '';

        // Thêm các lớp học phần vào bảng
        data.forEach((lhp, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${lhp.malhp}</td>
                <td>${lhp.giangvien || 'Chưa phân công'}</td>
                <td>${lhp.sosvtoida || 'N/A'}</td>
                <td>${lhp.lichhoc || 'Chưa cập nhật'}</td>
                <td>${lhp.phonghoc || 'Chưa phân phòng'}</td>
                <td>
                    <button class="select-btn" data-malhp="${lhp.malhp}">Đăng ký</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Thêm sự kiện cho các nút "Đăng ký" trong bảng lớp học phần
        tableBody.querySelectorAll('.select-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const malhp = this.getAttribute('data-malhp');
                registerClass(malhp);
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Lỗi: ${error.message}</td></tr>`;
    });
}

// Hàm đăng ký lớp học phần
// function registerClass(malhp) {
//     const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
//     if (!csrfToken) {
//         alert('Không tìm thấy CSRF token');
//         return;
//     }

//     if (confirm('Bạn có chắc chắn muốn đăng ký lớp học phần này?')) {
//         fetch(`/register/?action=add&malhp=${malhp}`, {
//             method: 'POST',
//             headers: {
//                 'X-CSRFToken': csrfToken,
//                 'Content-Type': 'application/json'
//             }
//         })
//         .then(response => {
//             // Check if response is JSON
//             const contentType = response.headers.get("content-type");
//             if (contentType && contentType.indexOf("application/json") !== -1) {
//                 return response.json();
//             } else {
//                 throw new Error("Received non-JSON response from server");
//             }
//         })
//         .then(data => {
//             if (data.status === 'success') {
//                 alert(data.message);
//                 hideSelectClassForm();
//                 location.reload(); // Refresh the page to show changes
//             } else {
//                 alert(data.message); // Hiển thị lỗi nếu có
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             alert('Có lỗi xảy ra khi đăng ký lớp học phần: ' + error.message);
//         });
//     }
// }

// Mảng tạm để lưu các mã học phần đã chọn
let selectedClasses = [];

function registerClass(malhp) {
    // Kiểm tra xem mã học phần đã được chọn chưa
    if (selectedClasses.includes(malhp)) {
        alert('Lớp học phần này đã được chọn!');
        return;
    }

    // Thêm mã học phần vào mảng tạm
    selectedClasses.push(malhp);

    // Lấy thông tin học phần từ server để hiển thị
    fetch(`/get_class_info/?malhp=${malhp}`)
        .then(response => {
            if (!response.ok) throw new Error('Không thể lấy thông tin học phần');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                // Cập nhật bảng kết quả đăng ký
                updateRegistrationTable(data.class_info);
                alert('Đã thêm học phần vào danh sách đăng ký!');
                hideSelectClassForm();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi lấy thông tin học phần: ' + error.message);
        });
}

// Hàm cập nhật bảng kết quả đăng ký
function updateRegistrationTable(classInfo) {
    const tbody = document.querySelector('.table-hocphan tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${selectedClasses.length}</td>
        <td>${classInfo.loai}</td>
        <td>${classInfo.mamh}</td>
        <td>${classInfo.tenhp}</td>
        <td>${classInfo.sotc}</td>
        <td><button class="btn-action btn-huy" data-mahp="${classInfo.mamh}">Hủy</button></td>
    `;
    tbody.appendChild(row);

    // Thêm sự kiện cho nút Hủy
    row.querySelector('.btn-huy').addEventListener('click', function () {
        const mahp = this.getAttribute('data-mahp');
        removeClass(mahp, row);
    });
}

// Hàm xóa học phần khỏi danh sách tạm
function removeClass(mahp, row) {
    if (confirm('Bạn có chắc chắn muốn xóa học phần này khỏi danh sách?')) {
        selectedClasses = selectedClasses.filter(item => item !== mahp);
        row.remove();
        alert('Đã xóa học phần khỏi danh sách!');
    }
}

function confirmRegistration() {
    if (selectedClasses.length === 0) {
        alert('Chưa có học phần nào được chọn!');
        return;
    }

    if (!confirm('Bạn có chắc chắn muốn xác nhận đăng ký tất cả học phần này?')) {
        return;
    }

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (!csrfToken) {
        alert('Không tìm thấy CSRF token');
        return;
    }

    // Gửi request POST với danh sách mã học phần
    fetch('/register_multiple/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ malhps: selectedClasses })
    })
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                throw new Error('Received non-JSON response from server');
            }
        })
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                selectedClasses = []; // Xóa danh sách tạm
                document.querySelector('.table-hocphan tbody').innerHTML = ''; // Xóa bảng
                location.reload(); // Refresh trang để cập nhật
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi xác nhận đăng ký: ' + error.message);
        });
}





function hideSelectClassForm() {
    const container = document.getElementById('selectClassContainer');
    container.style.display = 'none';
}

// THÊM
// Khởi tạo sự kiện khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    // Gắn sự kiện cho tất cả các nút "Đăng ký"
    document.querySelectorAll('.register-btn').forEach(button => {
        button.addEventListener('click', function() {
            const maHocPhan = this.dataset.maHocPhan; // Giả sử bạn có thuộc tính data-ma-hoc-phan trên nút
            showSelectClassForm(maHocPhan);
        });
    });
    
    // Gắn sự kiện cho các nút "Hủy" có sẵn trong trang
    // attachCancelButtonEvents();


    const btnsChon = document.querySelectorAll('#btn-dk');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (!csrfToken) {
        console.error('Không tìm thấy CSRF token');
        return;
    }
    btnsChon.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const maHp = row.children[2].textContent.trim();
            if (confirm('Bạn có chắc chắn muốn chọn lớp học phần này?')) {
                // Use the correct URL format for your combined view
                fetch(`/register/?action=add&mahp=${maHp}`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    // Check if response is JSON
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return response.json();
                    } else {
                        throw new Error("Received non-JSON response from server");
                    }
                })
                .then(data => {
                    if (data.status === 'success') {
                        alert(data.message); // "Đã thêm học phần thành công"
                        location.reload(); // Refresh the page to show changes
                    } else {
                        alert(data.message); // Hiển thị lỗi nếu có
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Có lỗi xảy ra khi đăng ký học phần: ' + error.message);
                });
            }
        });
    });
    const btnsHuy = document.querySelectorAll('.btn-huy');
    btnsHuy.forEach(btn => addHuyEventListener(btn));
});

// Hàm xử lý sự kiện hủy học phần
// Hàm xử lý sự kiện hủy học phần
function handleCancelCourse(btn) {
    const maHp = btn.getAttribute('data-mahp');
    console.log("Attempting to cancel course with mahp:", maHp);
    
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (!csrfToken) {
        alert('Không tìm thấy CSRF token');
        return;
    }
    
    if (confirm('Bạn có chắc chắn muốn hủy học phần này?')) {
        console.log(`Sending DELETE request to /register/?action=delete&mahp=${maHp}`);
        
        // Use the correct URL format for your combined view
        fetch(`/register/?action=delete&mahp=${maHp}`, {
            method: 'DELETE',
            headers: { 
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log("Response received:", response);
            console.log("Response status:", response.status);
            console.log("Content type:", response.headers.get("content-type"));
            
            // Clone response để có thể đọc text trước
            return response.text().then(text => {
                console.log("Raw response text:", text);
                
                try {
                    if (text && text.length > 0) {
                        const data = JSON.parse(text);
                        console.log("Parsed JSON data:", data);
                        return data;
                    } else {
                        throw new Error("Empty response");
                    }
                } catch (e) {
                    console.error("JSON parsing error:", e);
                    throw new Error("Invalid JSON response: " + text);
                }
            });
        })
        .then(data => {
            console.log("Processing data:", data);
            if (data.status === 'success') {
                alert(data.message); // "Đã xóa học phần thành công"
                location.reload(); // Refresh the page to show changes
            } else {
                alert(data.message); // Hiển thị lỗi nếu có
            }
        })
        .catch(error => {
            console.error('Error in fetch operation:', error);
            // In thêm chi tiết về lỗi
            console.error('Error details:', error.message);
            alert('Có lỗi xảy ra khi xóa học phần: ' + error.message);
        });
    }
}

// Hàm thêm sự kiện cho nút hủy
function addHuyEventListener(btn) {
    btn.addEventListener('click', () => handleCancelCourse(btn));
}
