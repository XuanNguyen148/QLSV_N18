function confirmRegistration() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (!csrfToken) {
        alert('Không tìm thấy CSRF token');
        return;
    }
    
    // Simply reload the page as in your original implementation
    location.reload();
}

// Hàm xử lý sự kiện hủy học phần
function handleCancelCourse(btn) {
    const maHp = btn.getAttribute('data-mahp');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (!csrfToken) {
        alert('Không tìm thấy CSRF token');
        return;
    }
    if (confirm('Bạn có chắc chắn muốn hủy học phần này?')) {
        // Use the correct URL format for your combined view
        fetch(`/ghi_danh/?action=delete&mahp=${maHp}`, {
            method: 'DELETE',
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
                alert(data.message); // "Đã xóa học phần thành công"
                location.reload(); // Refresh the page to show changes
            } else {
                alert(data.message); // Hiển thị lỗi nếu có
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi xóa học phần: ' + error.message);
        });
    }
}

// Hàm thêm sự kiện cho nút hủy
function addHuyEventListener(btn) {
    btn.addEventListener('click', () => handleCancelCourse(btn));
}

// Khởi tạo sự kiện khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    const btnsChon = document.querySelectorAll('#btn-chon');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (!csrfToken) {
        console.error('Không tìm thấy CSRF token');
        return;
    }
    btnsChon.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const maHp = row.children[2].textContent.trim();
            if (confirm('Bạn có chắc chắn muốn chọn học phần này?')) {
                // Use the correct URL format for your combined view
                fetch(`/ghi_danh/?action=add&mahp=${maHp}`, {
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
                    alert('Có lỗi xảy ra khi thêm học phần: ' + error.message);
                });
            }
        });
    });
    const btnsHuy = document.querySelectorAll('.btn-huy');
    btnsHuy.forEach(btn => addHuyEventListener(btn));
});