let originalTableData = [];

document.addEventListener('DOMContentLoaded', function () {
    // Lưu dữ liệu bảng gốc để lọc
    const tableRows = Array.from(document.querySelectorAll('#hocphanTableBody tr'));
    originalTableData = tableRows.map(row => {
        const columns = row.querySelectorAll('td');
        return {
            element: row.cloneNode(true),
            giangvien: columns[6].textContent
        };
    }).filter(item => item !== null);
});
    
// Hiển thị form thêm học phần
function showAddForm() {
    const formContainer = document.getElementById('addFormContainer');
    if (formContainer) {
        formContainer.style.display = 'block'; // Hiển thị form
        formContainer.classList.add('show'); // Thêm hiệu ứng mượt mà
    }
}

// Ẩn form thêm học phần
function hideAddForm() {
    const formContainer = document.getElementById('addFormContainer');
    if (formContainer) {
        formContainer.classList.remove('show'); // Ẩn hiệu ứng mượt mà
        setTimeout(() => {
            formContainer.style.display = 'none'; // Ẩn hoàn toàn sau hiệu ứng
        }, 300); // Delay khớp với thời gian transition trong CSS
    }
}

// Hiển thị form sửa học phần
function showEditForm(rowData) {
    const formContainer = document.getElementById('editFormContainer');
    if (formContainer) {
        // Hiển thị form
        formContainer.style.display = 'block';
        formContainer.classList.add('show');

        // Điền giá trị cũ vào form
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
        
        // Thu thập dữ liệu từ form
        const formData = {
            manganh: document.getElementById('maNganh').value,
            mahp: document.getElementById('maHP').value,
            malhp: document.getElementById('lopHP').value,
            sotc: document.getElementById('stc').value,
            loai: document.getElementById('loai').value,
            giangvien: document.getElementById('giangVien').value,
            hocky: document.getElementById('hocKy').value,
            lichhoc: document.getElementById('lichHoc').value,
            sosvtoida: document.getElementById('soSVToiDa').value
        };
        
        // Gửi dữ liệu đến server
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
                // Tải lại trang để hiển thị học phần mới
                window.location.reload();
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi thêm học phần');
        });
        
        // Ẩn form sau khi gửi
        hideAddForm();
    });
}

// Xử lý gửi form sửa học phần
const editForm = document.getElementById('editForm');
if (editForm) {
    editForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        // Thu thập dữ liệu từ form
        const formData = {
            manganh: document.getElementById('editMaNganh').value,
            malhp: document.getElementById('editLopHP').value,
            sotc: document.getElementById('editSTC').value,
            loai: document.getElementById('editLoai').value,
            giangvien: document.getElementById('editGiangVien').value,
            hocky: document.getElementById('editHocKy').value,
            lichhoc: document.getElementById('editLichHoc').value,
            sosvtoida: document.getElementById('editSoSVToiDa').value,
            phonghoc: document.getElementById('editPhongHoc').value, // Thêm dòng này
        };
        
        // Gửi dữ liệu đến server
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
                // Tải lại trang để hiển thị học phần đã cập nhật
                window.location.reload();
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi cập nhật học phần');
        });
        
        // Ẩn form sau khi gửi
        hideEditForm();
    });
}

// Gắn sự kiện cho nút tìm kiếm
const searchBtn = document.querySelector('.search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', filterData);
}

// Hàm lấy CSRF token từ cookie
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

// Xử lý nút xóa học phần
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
            .then(response => {
                console.log('Response status:', response.status); // Debug
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data); // Debug
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
    }// Xử lý nút "Sửa"
    else if (event.target.classList.contains('edit-btn')) {
        const infoCell = row.children[8]; // Cột "Thông tin"
        const infoParagraphs = infoCell.querySelectorAll('p');
        const soSVToiDaText = infoParagraphs[0].textContent.trim();
        const lichHocText = infoParagraphs[1].textContent.trim();
        const phongHocText = infoParagraphs[2].textContent.trim();

        const rowData = {
            maNganh: row.children[1].textContent.trim(),
            lopHP: row.children[2].textContent.trim(),
            stc: row.children[4].textContent.trim(),
            loai: row.children[5].textContent.trim() === 'Bắt buộc' ? 'Bắt buộc' : 'Tự chọn',
            giangVien: row.children[7].textContent.trim(), // Cột "Giảng viên"
            hocKy: row.children[6].textContent.trim(),    // Cột "Học kỳ"
            lichHoc: lichHocText.replace('Lịch học: ', '').trim(),
            soSVToiDa: soSVToiDaText.replace('Tối đa: ', '').replace(' sinh viên', '').trim(),
            phongHoc: phongHocText.replace('Phòng học: ', '').trim()
        };

        showEditForm(rowData);
    }
});


// Gắn sự kiện cho nút tìm kiếm
document.querySelector('.search-btn')?.addEventListener('click', filterData);

function filterData() {
    const searchType = document.getElementById('searchType').value; // Lấy loại tìm kiếm
    const keywordValue = document.getElementById('searchInput').value.toLowerCase().trim();
    const tableBody = document.getElementById('hocphanTableBody');
    
    // Xóa nội dung bảng hiện tại
    tableBody.innerHTML = '';
    
    // Đếm số thứ tự
    let counter = 1;
    
    // Lọc dữ liệu từ originalTableData
    const filteredRows = originalTableData.filter(row => {
        let match = false;
        if (searchType === 'ma_hp') {
            const maLHP = row.element.querySelectorAll('td')[2].textContent.toLowerCase(); // Cột mã LHP
            match = maLHP.includes(keywordValue);
        } else if (searchType === 'ten_hp') {
            const tenHP = row.element.querySelectorAll('td')[3].textContent.toLowerCase(); // Cột lớp HP
            match = tenHP.includes(keywordValue);
        } else if (searchType === 'giang_vien') {
            const giangVien = row.element.querySelectorAll('td')[6].textContent.toLowerCase(); // Cột Giảng viên
            match = giangVien.includes(keywordValue);
        }
        return keywordValue === '' || match;
    });
    
    // Thêm các hàng đã lọc vào bảng
    filteredRows.forEach(row => {
        const newRow = row.element.cloneNode(true);
        newRow.querySelectorAll('td')[0].textContent = counter++;
        tableBody.appendChild(newRow);
    });
    
    // Hiển thị thông báo nếu không tìm thấy kết quả
    if (filteredRows.length === 0) {
        const noResultsRow = document.createElement('tr');
        noResultsRow.innerHTML = '<td colspan="10" style="text-align: center;">Không tìm thấy kết quả phù hợp</td>';
        tableBody.appendChild(noResultsRow);
    }
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    filterData();
}

function showAllData() {
    document.getElementById('searchInput').value = '';
    
    const tableBody = document.getElementById('hocphanTableBody');
    tableBody.innerHTML = '';
    
    let counter = 1;
    
    originalTableData.forEach(row => {
        const newRow = row.element.cloneNode(true);
        newRow.querySelectorAll('td')[0].textContent = counter++;
        tableBody.appendChild(newRow);
    });
}