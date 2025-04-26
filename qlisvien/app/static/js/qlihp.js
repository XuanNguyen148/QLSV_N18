function search() {
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput').value;

    alert(`Tìm kiếm theo ${searchType} với từ khóa: ${searchInput}`);
    // Thêm logic tìm kiếm ở đây (gửi request đến server hoặc lọc dữ liệu trên client)
}

document.addEventListener('DOMContentLoaded', function () {
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
            document.getElementById('editMaHP').value = rowData.maHP;
            document.getElementById('editLopHP').value = rowData.lopHP;
            document.getElementById('editSTC').value = rowData.stc;
            document.getElementById('editLoai').value = rowData.loai;
            document.getElementById('editGiangVien').value = rowData.giangVien;
            document.getElementById('editHocKy').value = rowData.hocKy;
            document.getElementById('editLichHoc').value = rowData.lichHoc;
            document.getElementById('editSoSVToiDa').value = rowData.soSVToiDa;
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
            fetch('/qlihp/?action=add', {
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
                mahp: document.getElementById('editMaHP').value,
                malhp: document.getElementById('editLopHP').value,
                sotc: document.getElementById('editSTC').value,
                loai: document.getElementById('editLoai').value,
                giangvien: document.getElementById('editGiangVien').value,
                hocky: document.getElementById('editHocKy').value,
                lichhoc: document.getElementById('editLichHoc').value,
                sosvtoida: document.getElementById('editSoSVToiDa').value
            };
            
            // Gửi dữ liệu đến server
            fetch('/qlihp/?action=edit', {
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

    // Xử lý nút xóa học phần
    document.querySelectorAll('.delete-btn').forEach((button) => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const maHP = row.children[2].textContent.trim();
            
            if (confirm('Bạn có chắc chắn muốn xóa học phần này?')) {
                fetch(`/qlihp/?action=delete&mahp=${maHP}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert(data.message);
                        // Xóa dòng khỏi bảng
                        row.remove();
                    } else {
                        alert('Lỗi: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Đã xảy ra lỗi khi xóa học phần');
                });
            }
        });
    });

    // Gắn sự kiện cho nút "Sửa"
    document.querySelectorAll('.edit-btn').forEach((button) => {
        button.addEventListener('click', function () {
            const row = this.closest('tr'); // Lấy dòng chứa nút "Sửa"
            const rowData = {
                maNganh: row.children[1].textContent.trim(),
                maHP: row.children[2].textContent.trim(),
                lopHP: row.children[3].textContent.trim(),
                stc: row.children[4].textContent.trim(),
                loai: row.children[5].textContent.trim() === 'Bắt buộc' ? 'bat_buoc' : 'tu_chon',
                giangVien: row.children[6].textContent.trim(),
                hocKy: "", // Default values if not available
                lichHoc: "",
                soSVToiDa: ""
            };
            
            // Extract additional info if available
            const infoCell = row.children[7];
            if (infoCell && infoCell.innerHTML.includes('<br>')) {
                const infoParts = infoCell.innerHTML.split('<br>');
                if (infoParts.length >= 1 && infoParts[0].includes(':')) {
                    rowData.hocKy = infoParts[0].split(':')[1].trim();
                }
                if (infoParts.length >= 2 && infoParts[1].includes(':')) {
                    rowData.lichHoc = infoParts[1].split(':')[1].trim();
                }
                if (infoParts.length >= 3 && infoParts[2].includes(':')) {
                    rowData.soSVToiDa = infoParts[2].split(':')[1].trim();
                }
            }
            
            showEditForm(rowData);
        });
    });

    // Gắn sự kiện cho nút tìm kiếm
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', search);
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
});