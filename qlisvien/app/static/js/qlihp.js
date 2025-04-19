function search() {
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput').value;

    alert(`Tìm kiếm theo ${searchType} với từ khóa: ${searchInput}`);
    // Thêm logic tìm kiếm ở đây (gửi request đến server hoặc lọc dữ liệu trên client)
}

function addHocPhan() {
    alert('Chức năng thêm học phần!');
    // Thêm logic hiển thị form thêm học phần ở đây
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
                hocKy: row.children[7].innerHTML.split('<br>')[0].split(': ')[1].trim(),
                lichHoc: row.children[7].innerHTML.split('<br>')[1].split(': ')[1].trim(),
                soSVToiDa: row.children[7].innerHTML.split('<br>')[2].split(': ')[1].trim(),
            };
            showEditForm(rowData);
        });
    });

    // Gắn hàm vào window để sử dụng trong HTML
    window.showAddForm = showAddForm;
    window.hideAddForm = hideAddForm;
    window.showEditForm = showEditForm;
    window.hideEditForm = hideEditForm;
});