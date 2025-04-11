/* filepath: e:\da3 django\QLSV_N18\qlisvien\app\static\js\author.js */
// Hàm tìm kiếm tài khoản
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchValue = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchValue) ? '' : 'none';
    });
});

// Hàm thay đổi role
function changeRole(select, userId) {
    const row = select.closest('tr');
    const roleBadge = row.querySelector('.role-badge');
    
    // Cập nhật badge hiển thị
    roleBadge.textContent = select.options[select.selectedIndex].text;
    roleBadge.className = `role-badge ${select.value}`;
}

// Hàm lưu thay đổi role
function saveRole(userId) {
    const row = document.querySelector(`tr[data-id="${userId}"]`);
    const select = row.querySelector('.role-select');
    const newRole = select.value;
    
    // TODO: Gửi request API để cập nhật role
    alert(`Đã cập nhật role cho user ${userId} thành ${select.options[select.selectedIndex].text}`);
}