let originalTableData = [];
let currentPage = 1;
const rowsPerPage = 10;

document.addEventListener('DOMContentLoaded', function () {
    // Lưu dữ liệu bảng gốc để lọc
    const tableRows = Array.from(document.querySelectorAll('#hocphanTableBody tr'));
    originalTableData = tableRows.map(row => ({
        element: row.cloneNode(true),
        giangvien: row.querySelectorAll('td')[7].textContent // Cột Giảng viên
    })).filter(item => item !== null);

    // Hiển thị trang đầu tiên
    renderTable();
});

// Hiển thị form thêm học phần
function showAddForm() {
    const formContainer = document.getElementById('addFormContainer');
    if (formContainer) {
        formContainer.style.display = 'block';
        formContainer.classList.add('show');
    }
}

// Ẩn form thêm học phần
function hideAddForm() {
    const formContainer = document.getElementById('addFormContainer');
    if (formContainer) {
        formContainer.classList.remove('show');
        setTimeout(() => {
            formContainer.style.display = 'none';
        }, 300);
    }
}

// Hiển thị form sửa học phần
function showEditForm(rowData) {
    const formContainer = document.getElementById('editFormContainer');
    if (formContainer) {
        formContainer.style.display = 'block';
        formContainer.classList.add('show');

        document.getElementById('editMaNganh').value = rowData.maNganh;
        document.getElementById('editLopHP').value = rowData.lopHP;
        document.getElementById('editSTC').value = rowData.stc;
        document.getElementById('editLoai').value = rowData.loai;
        document.getElementById('editGiangVien').value = rowData.giangVien;
        document.getElementById('editHocKy').value = rowData.hocKy;
        document.getElementById('editLichHoc').value = rowData.lichHoc;
        document.getElementById('editSoSVToiDa').value = rowData.soSVToiDa;
        document.getElementById('editPhongHoc').value = rowData.phongHoc;
    }
}

// Ẩn form sửa học phần
function hideEditForm() {
    const formContainer = document.getElementById('editFormContainer');
    if (formContainer) {
        formContainer.classList.remove('show');
        setTimeout(() => {
            formContainer.style.display = 'none';
        }, 300);
    }
}

// Xử lý gửi form thêm học phần
const addForm = document.getElementById('addForm');
if (addForm) {
    addForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const formData = {
            manganh: document.getElementById('maNganh').value,
            mahp: document.getElementById('maHP').value,
            malhp: document.getElementById('lopHP').value,
            sotc: document.getElementById('stc').value,
            giangvien: document.getElementById('giangVien').value,
            lichhoc: document.getElementById('lichHoc').value,
            sosvtoida: document.getElementById('soSVToiDa').value,
            phonghoc: document.getElementById('phongHoc').value,
        };
        
        fetch('/quan_ly_hoc_phan/?action=add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                window.location.reload();
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi thêm học phần');
        });
        
        hideAddForm();
    });
}

// Xử lý gửi form sửa học phần
const editForm = document.getElementById('editForm');
if (editForm) {
    editForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const formData = {
            manganh: document.getElementById('editMaNganh').value,
            malhp: document.getElementById('editLopHP').value,
            sotc: document.getElementById('editSTC').value,
            loai: document.getElementById('editLoai').value,
            giangvien: document.getElementById('editGiangVien').value,
            hocky: document.getElementById('editHocKy').value,
            lichhoc: document.getElementById('editLichHoc').value,
            sosvtoida: document.getElementById('editSoSVToiDa').value,
            phonghoc: document.getElementById('editPhongHoc').value,
        };
        
        fetch('/quan_ly_hoc_phan/?action=edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                window.location.reload();
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi cập nhật học phần');
        });
        
        hideEditForm();
    });
}

// Lấy CSRF token từ cookie
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

// Gắn hàm vào window để sử dụng trong HTML
window.showAddForm = showAddForm;
window.hideAddForm = hideAddForm;
window.showEditForm = showEditForm;
window.hideEditForm = hideEditForm;
window.goToPreviousPage = goToPreviousPage;
window.goToNextPage = goToNextPage;

// Xử lý nút xóa và sửa học phần
document.getElementById('hocphanTableBody').addEventListener('click', function (event) {
    const row = event.target.closest('tr');

    if (event.target.classList.contains('delete-btn')) {
        const maLHP = row.children[2].textContent.trim();
        
        if (confirm('Bạn có chắc chắn muốn xóa học phần này?')) {
            fetch(`/quan_ly_hoc_phan/?action=delete&malhp=${maLHP}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(data.message);
                    location.reload();
                } else {
                    alert('Lỗi: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi khi xóa học phần');
            });
        }
    } else if (event.target.classList.contains('edit-btn')) {
        const infoCell = row.children[8];
        const infoParagraphs = infoCell.querySelectorAll('p');
        const soSVToiDaText = infoParagraphs[0].textContent.trim();
        const lichHocText = infoParagraphs[1].textContent.trim();
        const phongHocText = infoParagraphs[2].textContent.trim();

        const rowData = {
            maNganh: row.children[1].textContent.trim(),
            lopHP: row.children[2].textContent.trim(),
            stc: row.children[4].textContent.trim(),
            loai: row.children[5].textContent.trim() === 'Bắt buộc' ? 'Bắt buộc' : 'Tự chọn',
            giangVien: row.children[7].textContent.trim(),
            hocKy: row.children[6].textContent.trim(),
            lichHoc: lichHocText.replace('Lịch học: ', '').trim(),
            soSVToiDa: soSVToiDaText.replace('Tối đa: ', '').replace(' sinh viên', '').trim(),
            phongHoc: phongHocText.replace('Phòng học: ', '').trim()
        };

        showEditForm(rowData);
    }
});

// Hàm render bảng với phân trang
function renderTable(filteredRows = originalTableData) {
    const tableBody = document.getElementById('hocphanTableBody');
    tableBody.innerHTML = '';

    // Tính toán chỉ số bắt đầu và kết thúc
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedRows = filteredRows.slice(startIndex, endIndex);

    // Đếm số thứ tự
    let counter = startIndex + 1;

    // Thêm các hàng vào bảng
    paginatedRows.forEach(row => {
        const newRow = row.element.cloneNode(true);
        newRow.querySelectorAll('td')[0].textContent = counter++;
        tableBody.appendChild(newRow);
    });

    // Hiển thị thông báo nếu không có kết quả
    if (paginatedRows.length === 0) {
        const noResultsRow = document.createElement('tr');
        noResultsRow.innerHTML = '<td colspan="10" style="text-align: center;">Không tìm thấy kết quả phù hợp</td>';
        tableBody.appendChild(noResultsRow);
    }

    // Cập nhật thông tin phân trang
    updatePagination(filteredRows.length);
}

// Cập nhật thông tin phân trang
function updatePagination(totalRows) {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    pageInfo.textContent = `Trang ${currentPage} / ${totalPages || 1}`;

    // Vô hiệu hóa nút "Trước" nếu ở trang đầu
    document.querySelector('.page-btn[onclick="goToPreviousPage()"]').disabled = currentPage === 1;
    // Vô hiệu hóa nút "Sau" nếu ở trang cuối
    document.querySelector('.page-btn[onclick="goToNextPage()"]').disabled = currentPage === totalPages || totalPages === 0;
}

// Chuyển đến trang trước
function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

// Chuyển đến trang tiếp theo
function goToNextPage() {
    const totalRows = originalTableData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

// Lọc dữ liệu
function filterData() {
    const searchType = document.getElementById('searchType').value;
    const keywordValue = document.getElementById('searchInput').value.toLowerCase().trim();

    // Lọc dữ liệu
    const filteredRows = originalTableData.filter(row => {
        let match = false;
        if (searchType === 'ma_hp') {
            const maLHP = row.element.querySelectorAll('td')[2].textContent.toLowerCase();
            match = maLHP.includes(keywordValue);
        } else if (searchType === 'ten_hp') {
            const tenHP = row.element.querySelectorAll('td')[3].textContent.toLowerCase();
            match = tenHP.includes(keywordValue);
        } else if (searchType === 'giang_vien') {
            const giangVien = row.element.querySelectorAll('td')[7].textContent.toLowerCase();
            match = giangVien.includes(keywordValue);
        }
        return keywordValue === '' || match;
    });

    // Reset về trang đầu khi lọc
    currentPage = 1;
    renderTable(filteredRows);
}

// Reset bộ lọc
function resetFilters() {
    document.getElementById('searchInput').value = '';
    currentPage = 1;
    renderTable();
}

// Hiển thị toàn bộ dữ liệu
function showAllData() {
    document.getElementById('searchInput').value = '';
    currentPage = 1;
    renderTable();
}

// Gắn sự kiện cho nút tìm kiếm
document.querySelector('.search-btn')?.addEventListener('click', filterData);