// Hàm tìm kiếm tài khoản
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchValue = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchValue) ? '' : 'none';
    });
});

// Hàm lưu thay đổi role
function saveRole(userId) {
    const row = document.querySelector(`tr[data-id="${userId}"]`);
    const select = row.querySelector('.role-select');
    const newRole = select.value;
    
    fetch('/update_role/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // Lấy CSRF token
        },
        body: JSON.stringify({ userId: userId, newRole: newRole })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cập nhật role thành công');
            location.reload();  // Tải lại trang để cập nhật danh sách
        } else {
            alert('Có lỗi xảy ra: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra');
    });
}

// Hàm lấy CSRF token từ cookie (yêu cầu cho POST trong Django)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}