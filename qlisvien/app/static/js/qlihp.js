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