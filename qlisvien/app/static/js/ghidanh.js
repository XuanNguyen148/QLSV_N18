// function confirmRegistration() {
//     const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
//     if (!csrfToken) {
//         alert('Không tìm thấy CSRF token');
//         return;
//     }
    
//     // Simply reload the page as in your original implementation
//     location.reload();
// }

function confirmRegistration() {
    if (selectedCourses.length === 0) {
        alert('Chưa có học phần nào được chọn!');
        return;
    }

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (!csrfToken) {
        console.error('Không tìm thấy CSRF token');
        return;
    }

    // Gửi danh sách học phần lên server
    fetch('/ghi_danh/?action=add_multiple', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courses: selectedCourses.map(course => course.maHp) })
    })
    .then(response => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        } else {
            throw new Error("Received non-JSON response from server");
        }
    })
    .then(data => {
        if (data.status === 'success') {
            alert(data.message); // "Đã đăng ký các học phần thành công"
            selectedCourses.length = 0; // Xóa danh sách tạm
            updateTable(); // Xóa bảng
            location.reload(); // Refresh trang để cập nhật
        } else {
            alert(data.message); // Hiển thị lỗi nếu có
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.');
    });
}

// Hàm xử lý sự kiện hủy học phần
// function handleCancelCourse(btn) {
//     const maHp = btn.getAttribute('data-mahp');
//     const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
//     if (!csrfToken) {
//         alert('Không tìm thấy CSRF token');
//         return;
//     }
//     if (confirm('Bạn có chắc chắn muốn hủy học phần này?')) {
//         // Use the correct URL format for your combined view
//         fetch(`/ghi_danh/?action=delete&mahp=${maHp}`, {
//             method: 'DELETE',
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
//                 alert(data.message); // "Đã xóa học phần thành công"
//                 location.reload(); // Refresh the page to show changes
//             } else {
//                 alert(data.message); // Hiển thị lỗi nếu có
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             alert('Có lỗi xảy ra khi xóa học phần: ' + error.message);
//         });
//     }
// }

// // Hàm thêm sự kiện cho nút hủy
// function addHuyEventListener(btn) {
//     btn.addEventListener('click', () => handleCancelCourse(btn));
// }

// Khởi tạo sự kiện khi trang được load
// document.addEventListener('DOMContentLoaded', function() {
//     const btnsChon = document.querySelectorAll('#btn-chon');
//     const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
//     if (!csrfToken) {
//         console.error('Không tìm thấy CSRF token');
//         return;
//     }
//     btnsChon.forEach(function(btn) {
//         btn.addEventListener('click', function() {
//             const row = this.closest('tr');
//             const maHp = row.children[2].textContent.trim();
//             if (confirm('Bạn có chắc chắn muốn chọn học phần này?')) {
//                 // Use the correct URL format for your combined view
//                 fetch(`/ghi_danh/?action=add&mahp=${maHp}`, {
//                     method: 'POST',
//                     headers: {
//                         'X-CSRFToken': csrfToken,
//                         'Content-Type': 'application/json'
//                     }
//                 })
//                 .then(response => {
//                     // Check if response is JSON
//                     const contentType = response.headers.get("content-type");
//                     if (contentType && contentType.indexOf("application/json") !== -1) {
//                         return response.json();
//                     } else {
//                         throw new Error("Received non-JSON response from server");
//                     }
//                 })
//                 .then(data => {
//                     if (data.status === 'success') {
//                         alert(data.message); // "Đã thêm học phần thành công"
//                         location.reload(); // Refresh the page to show changes
//                     } else {
//                         alert(data.message); // Hiển thị lỗi nếu có
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                     alert('Có lỗi xảy ra khi thêm học phần: ' + error.message);
//                 });
//             }
//         });
//     });
//     const btnsHuy = document.querySelectorAll('.btn-huy');
//     btnsHuy.forEach(btn => addHuyEventListener(btn));
// });

// document.addEventListener('DOMContentLoaded', function() {
//     const btnsChon = document.querySelectorAll('#btn-chon');
//     const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
//     const selectedCourses = []; // Mảng lưu các học phần đã chọn
//     const tbody = document.querySelector('.table-hocphan tbody');

//     if (!csrfToken) {
//         console.error('Không tìm thấy CSRF token');
//         return;
//     }

//     // Xử lý sự kiện khi nhấn nút "Chọn"
//     btnsChon.forEach(function(btn) {
//         btn.addEventListener('click', function() {
//             const row = this.closest('tr');
//             const maHp = row.children[2].textContent.trim();
//             const tenHp = row.children[3].textContent.trim();
//             const loai = row.children[1].textContent.trim();
//             const sotc = row.children[4].textContent.trim();

//             // Kiểm tra xem học phần đã được chọn chưa
//             if (selectedCourses.some(course => course.maHp === maHp)) {
//                 alert('Học phần này đã được chọn!');
//                 return;
//             }

//             // Thêm học phần vào mảng tạm
//             selectedCourses.push({ maHp, tenHp, loai, sotc });

//             // Cập nhật bảng kết quả đăng ký
//             updateTable();
//         });
//     });

//     // Hàm cập nhật bảng kết quả đăng ký
//     function updateTable() {
//         tbody.innerHTML = ''; // Xóa nội dung cũ
//         selectedCourses.forEach((course, index) => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${index + 1}</td>
//                 <td>${course.loai}</td>
//                 <td>${course.maHp}</td>
//                 <td>${course.tenHp}</td>
//                 <td>${course.sotc}</td>
//                 <td><button class="btn-action btn-huy" data-mahp="${course.maHp}">Hủy</button></td>
//             `;
//             tbody.appendChild(row);
//         });

//         // Thêm sự kiện cho các nút "Hủy"
//         document.querySelectorAll('.btn-huy').forEach(btn => {
//             btn.addEventListener('click', function() {
//                 const maHp = this.getAttribute('data-mahp');
//                 const index = selectedCourses.findIndex(course => course.maHp === maHp);
//                 if (index !== -1) {
//                     selectedCourses.splice(index, 1); // Xóa học phần khỏi mảng
//                     updateTable(); // Cập nhật lại bảng
//                 }
//             });
//         });
//     }

//     // Hàm xác nhận đăng ký (gửi hàng loạt học phần)
//     window.confirmRegistration = function() {
//         if (selectedCourses.length === 0) {
//             alert('Chưa có học phần nào được chọn!');
//             return;
//         }

//         fetch('/ghi_danh/?action=add_multiple', {
//             method: 'POST',
//             headers: {
//                 'X-CSRFToken': csrfToken,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ courses: selectedCourses.map(course => course.maHp) })
//         })
//         .then(response => {
//             const contentType = response.headers.get("content-type");
//             if (contentType && contentType.indexOf("application/json") !== -1) {
//                 return response.json();
//             } else {
//                 throw new Error("Received non-JSON response from server");
//             }
//         })
//         .then(data => {
//             if (data.status === 'success') {
//                 alert(data.message); // "Đã đăng ký các học phần thành công"
//                 selectedCourses.length = 0; // Xóa danh sách tạm
//                 updateTable(); // Xóa bảng
//                 location.reload(); // Refresh trang để cập nhật
//             } else {
//                 alert(data.message); // Hiển thị lỗi nếu có
//             }
//         })
//         .catch(error => {
//             console.error('Lỗi:', error);
//             alert('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.');
//         });
//     };
// });

document.addEventListener('DOMContentLoaded', function() {
    const btnsChon = document.querySelectorAll('.btn-chon');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    const selectedCourses = []; // Mảng lưu các học phần đã chọn
    const tbodyKqdk = document.querySelector('#table-kqdk tbody');

    if (!csrfToken) {
        console.error('Không tìm thấy CSRF token');
        return;
    }

    // Xử lý sự kiện khi nhấn nút "Chọn"
    btnsChon.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const maHp = row.children[2].textContent.trim();
            const tenHp = row.children[3].textContent.trim();
            const loai = row.children[1].textContent.trim();
            const sotc = row.children[4].textContent.trim();

            // Kiểm tra xem học phần đã được chọn chưa
            if (selectedCourses.some(course => course.maHp === maHp)) {
                alert('Học phần này đã được chọn!');
                return;
            }

            // Kiểm tra xem học phần đã có trong bảng kqdk chưa
            const existingRows = tbodyKqdk.querySelectorAll('tr');
            for (let row of existingRows) {
                if (row.children[2].textContent.trim() === maHp) {
                    alert('Học phần này đã được đăng ký!');
                    return;
                }
            }

            // Thêm học phần vào mảng tạm
            selectedCourses.push({ maHp, tenHp, loai, sotc });

            // Cập nhật bảng kết quả đăng ký
            updateTable();
        });
    });

    // Hàm cập nhật bảng kết quả đăng ký
    function updateTable() {
        // Giữ nguyên các học phần đã đăng ký từ server (kqdk)
        // Chỉ thêm các học phần mới từ selectedCourses
        const existingRows = tbodyKqdk.querySelectorAll('tr:not(.temporary)');
        const newRows = selectedCourses.map((course, index) => {
            const row = document.createElement('tr');
            row.classList.add('temporary'); // Đánh dấu các hàng tạm
            row.innerHTML = `
                <td>${existingRows.length + index + 1}</td>
                <td>${course.loai}</td>
                <td>${course.maHp}</td>
                <td>${course.tenHp}</td>
                <td>${course.sotc}</td>
                <td><button class="btn-action btn-huy" data-mahp="${course.maHp}">Hủy</button></td>
            `;
            return row;
        });

        // Xóa các hàng tạm cũ
        tbodyKqdk.querySelectorAll('.temporary').forEach(row => row.remove());

        // Thêm các hàng mới
        newRows.forEach(row => tbodyKqdk.appendChild(row));

        // Thêm sự kiện cho tất cả các nút "Hủy"
        tbodyKqdk.querySelectorAll('.btn-huy').forEach(btn => {
            // Xóa các sự kiện cũ để tránh trùng lặp
            btn.removeEventListener('click', handleCancelCourse);
            addHuyEventListener(btn);
        });
    }

    // Hàm xử lý sự kiện hủy học phần
    function handleCancelCourse(btn) {
        const maHp = btn.getAttribute('data-mahp');
        const isTemporary = btn.closest('tr').classList.contains('temporary');

        if (isTemporary) {
            // Nếu là học phần tạm, chỉ xóa khỏi selectedCourses
            const index = selectedCourses.findIndex(course => course.maHp === maHp);
            if (index !== -1) {
                if (confirm('Bạn có chắc chắn muốn hủy học phần này?')) {
                    selectedCourses.splice(index, 1); // Xóa học phần khỏi mảng
                    updateTable(); // Cập nhật lại bảng
                }
            }
        } else {
            // Nếu là học phần đã đăng ký, gửi request DELETE
            if (!csrfToken) {
                alert('Không tìm thấy CSRF token');
                return;
            }
            if (confirm('Bạn có chắc chắn muốn hủy học phần này?')) {
                fetch(`/ghi_danh/?action=delete&mahp=${maHp}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
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
    }

    // Hàm thêm sự kiện cho nút hủy
    function addHuyEventListener(btn) {
        btn.addEventListener('click', () => handleCancelCourse(btn));
    }

    // Hàm xác nhận đăng ký (gửi hàng loạt học phần)
    window.confirmRegistration = function() {
        if (selectedCourses.length === 0) {
            alert('Chưa có học phần nào được chọn!');
            return;
        }

        fetch('/ghi_danh/?action=add_multiple', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courses: selectedCourses.map(course => course.maHp) })
        })
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else {
                throw new Error("Received non-JSON response from server");
            }
        })
        .then(data => {
            if (data.status === 'success') {
                alert(data.message); // "Đã đăng ký các học phần thành công"
                selectedCourses.length = 0; // Xóa danh sách tạm
                updateTable(); // Cập nhật bảng
                location.reload(); // Refresh trang để cập nhật
            } else {
                alert(data.message); // Hiển thị lỗi nếu có
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.');
        });
    };

    // Khởi tạo sự kiện cho các nút "Hủy" hiện có từ server
    tbodyKqdk.querySelectorAll('.btn-huy').forEach(btn => {
        addHuyEventListener(btn);
    });
});

