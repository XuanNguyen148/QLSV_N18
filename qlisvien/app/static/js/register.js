// hoàn tác trước đây

// Khai báo danh sách tạm để lưu các lớp học phần đã chọn
let selectedClasses = [];

// Khi DOM được tải xong, gắn sự kiện cho các nút
document.addEventListener('DOMContentLoaded', function() {
    // Gắn sự kiện cho các nút "Đăng ký" trong bảng học phần
    document.querySelectorAll('.register-btn').forEach(button => {
        button.addEventListener('click', function() {
            const maHocPhan = this.getAttribute('data-ma-hoc-phan');
            let tenHp;
            
            // If it's a "Chuyển lớp" button, get the course name from the row
            if (this.innerText === 'Chuyển lớp') {
                const row = this.closest('tr');
                tenHp = row.children[2].textContent; // Get text from the third column (tên học phần)
            } else {
                tenHp = this.getAttribute('data-tenhp');
            }
            
            showSelectClassForm(maHocPhan, tenHp);
        });
    });

    // Gắn sự kiện cho các nút "Hủy" trong bảng kết quả đăng ký
    document.querySelectorAll('#result-table .btn-huy').forEach(btn => {
        btn.addEventListener('click', function() {
            handleCancelCourse(this);
        });
    });
});

// Hiển thị form chọn lớp học phần
function showSelectClassForm(maHocPhan, tenHp) {
    const container = document.getElementById('selectClassContainer');
    container.style.display = 'flex';
    const tableBody = container.querySelector('tbody');
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Đang tải...</td></tr>';

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (!csrfToken) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Lỗi: Không tìm thấy CSRF token</td></tr>';
        return;
    }

    fetch(`/get_lophocphan/?mahp=${maHocPhan}`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Lỗi khi tải danh sách lớp học phần');
        return response.json();
    })
    .then(data => {
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Không có lớp học phần nào cho học phần này</td></tr>';
            return;
        }

        tableBody.innerHTML = '';
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
                    <button class="select-btn" 
                            data-malhp="${lhp.malhp}" 
                            data-mahp="${maHocPhan}" 
                            data-tenhp="${tenHp}"
                            data-sotc="${lhp.sotc}"
                            data-giangvien="${lhp.giangvien || 'Chưa phân công'}" 
                            data-lichhoc="${lhp.lichhoc || 'Chưa cập nhật'}" 
                            data-phonghoc="${lhp.phonghoc || 'Chưa cập nhật'}">Chọn</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        tableBody.querySelectorAll('.select-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const malhp = this.getAttribute('data-malhp');
                const mahp = this.getAttribute('data-mahp');
                const tenHp = this.getAttribute('data-tenhp');
                const giangvien = this.getAttribute('data-giangvien');
                const lichhoc = this.getAttribute('data-lichhoc');
                const phonghoc = this.getAttribute('data-phonghoc');                
                const sotc = this.getAttribute('data-sotc');
                const lhp = { malhp, mahp, tenHp, giangvien, lichhoc, phonghoc, sotc };
                addToSelectedClasses(lhp);
                updateSelectedClassesTable();
                hideSelectClassForm();
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Lỗi: ${error.message}</td></tr>`;
    });
}

// Thêm lớp học phần vào danh sách tạm
function addToSelectedClasses(lhp) {
    const index = selectedClasses.findIndex(item => item.mahp === lhp.mahp);
    if (index !== -1) {
        selectedClasses[index] = lhp; // Thay thế nếu đã có lớp cho học phần này
    } else {
        selectedClasses.push(lhp);
    }
}

// Cập nhật bảng kết quả đăng ký với các lớp tạm
function updateSelectedClassesTable() {
    const tbody = document.querySelector('#result-table tbody');
    // Xóa các hàng tạm cũ
    tbody.querySelectorAll('.temporary').forEach(row => row.remove());
    // Thêm các hàng tạm mới
    selectedClasses.forEach((lhp, index) => {
        const row = document.createElement('tr');
        row.classList.add('temporary');
        row.innerHTML = `
            <td>${tbody.children.length + 1}</td>
            <td>${lhp.malhp}</td>
            <td>${lhp.tenHp}</td>
            <td>${lhp.sotc}</td>
            <td>${lhp.giangvien}</td>
            <td>${lhp.phonghoc}</td>
            <td><button class="cancel-btn btn-huy" data-malhp="${lhp.malhp}">Hủy</button></td>
        `;
        tbody.appendChild(row);
    });
    // Gắn sự kiện cho nút "Hủy" trong các hàng tạm
    tbody.querySelectorAll('.temporary .btn-huy').forEach(btn => {
        btn.addEventListener('click', function() {
            handleCancelCourse(this);
        });
    });
}

// Xử lý hủy lớp học phần
function handleCancelCourse(btn) {
    const malhp = btn.getAttribute('data-malhp');
    const row = btn.closest('tr');
    
    // Kiểm tra số tín chỉ trước khi hủy
    if (!row.classList.contains('temporary')) {
    // Kiểm tra học phần bắt buộc trước khi hủy
        const courseCode = row.querySelector('td:nth-child(2)').textContent?.trim().split('.')[0];
        const requiredCourses = getRequiredCourses();
        
        if (requiredCourses.includes(courseCode)) {
            alert('Không thể hủy học phần bắt buộc!');
            return;
        }

        const currentCredits = calculateTotalCredits();
        const courseCredits = parseInt(row.querySelector('td:nth-child(4)').textContent || 0);
        const remainingCredits = currentCredits - courseCredits;
        
        if (remainingCredits < 15) {
            alert(`Không thể hủy đăng ký lớp học phần!\nSố tín chỉ sau khi hủy (${remainingCredits}). Mức tín chỉ tối thiểu tối thiểu (15 tín chỉ).`);
            return;
        }
    }

    if (row.classList.contains('temporary')) {
        // Xóa trực tiếp không cần xác nhận cho bảng tạm
        selectedClasses = selectedClasses.filter(item => item.malhp !== malhp);
        updateSelectedClassesTable();
    } else {
        // Giữ nguyên confirm cho việc hủy đăng ký thật
        if (confirm('Bạn có chắc chắn muốn hủy đăng ký lớp học phần này?')) {
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
            fetch(`/register/?action=delete&mahp=${malhp}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': csrfToken,  
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(data.message);
                    location.reload();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi xóa lớp học phần: ' + error.message);
            });
        }
    }
}

// hoàn tác 02
// Thêm hàm tính tổng số tín chỉ
function calculateTotalCredits() {
    // Tính tổng số tín chỉ từ danh sách tạm
    const tempCredits = selectedClasses.reduce((sum, item) => sum + parseInt(item.sotc || 0), 0);
    
    // Tính tổng số tín chỉ từ các môn đã đăng ký
    const registeredRows = Array.from(document.querySelectorAll('#result-table tbody tr:not(.temporary)'));
    const registeredCredits = registeredRows.reduce((sum, row) => {
        const creditCell = row.querySelector('td:nth-child(4)');
        return sum + parseInt(creditCell?.textContent || 0);
    }, 0);

    return tempCredits + registeredCredits;
}

// Add this function to get list of required courses
function getRequiredCourses() {
    const requiredCourses = [];
    // Get all rows under "Các môn bắt buộc" section
    const tableRows = document.querySelectorAll('.custom-table tbody tr');
    let isRequiredSection = false;
    
    for (const row of tableRows) {
        if (row.classList.contains('section-header')) {
            isRequiredSection = row.textContent.includes('Các môn bắt buộc');
            continue;
        }
        
        if (isRequiredSection && !row.classList.contains('section-header')) {
            const courseCode = row.children[1]?.textContent?.trim();
            if (courseCode) {
                requiredCourses.push(courseCode);
            }
        }
        
        // Stop when we reach next section
        if (isRequiredSection && row.classList.contains('section-header')) {
            break;
        }
    }
    return requiredCourses;
}

// Add this function to check if all required courses are selected
function checkRequiredCourses() {
    const requiredCourses = getRequiredCourses();
    
    // Get all selected courses (both temporary and registered)
    const selectedMahps = selectedClasses.map(c => c.mahp);
    const registeredRows = Array.from(document.querySelectorAll('#result-table tbody tr:not(.temporary)'));
    const registeredMahps = registeredRows.map(row => {
        const courseCell = row.children[1]?.textContent?.trim();
        return courseCell?.split('.')[0]; // Get base course code without section number
    });
    
    const allSelectedMahps = [...selectedMahps, ...registeredMahps];
    
    // Check if all required courses are selected
    const missingCourses = requiredCourses.filter(course => 
        !allSelectedMahps.some(selected => selected?.startsWith(course))
    );
    
    return {
        isComplete: missingCourses.length === 0,
        missingCourses
    };
}

// Sửa lại hàm confirmRegistration
window.confirmRegistration = function() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (!csrfToken) {
        alert('Không tìm thấy CSRF token');
        return;
    }

    if (selectedClasses.length === 0) {
        alert('Chưa có lớp học phần nào được chọn!');
        return;
    }

    // Check required courses
    const requiredCoursesCheck = checkRequiredCourses();
    if (!requiredCoursesCheck.isComplete) {
        alert(`Bạn cần đăng ký đủ các môn bắt buộc trước khi xác nhận!\nCác môn còn thiếu: ${requiredCoursesCheck.missingCourses.join(', ')}`);
        return;
    }

    // Check total credits
    const totalCredits = calculateTotalCredits();
    if (totalCredits < 15) {
        alert(`Tổng số tín chỉ phải từ 15 trở lên. Hiện tại: ${totalCredits} tín chỉ`);
        return;
    } else if (totalCredits > 25) {
        alert(`Tổng số tín chỉ không được vượt quá 25. Hiện tại: ${totalCredits} tín chỉ`);
        return;
    }

    // Proceed with registration
    fetch('/register/?action=add_multiple', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ classes: selectedClasses.map(lhp => lhp.malhp) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert(data.message);
            selectedClasses = [];
            updateSelectedClassesTable();
            location.reload();
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Đã xảy ra lỗi khi gửi yêu cầu: ' + error.message);
    });
};

// Ẩn form chọn lớp học phần
function hideSelectClassForm() {
    document.getElementById('selectClassContainer').style.display = 'none';
}