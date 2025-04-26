let originalTableData = [];

document.addEventListener('DOMContentLoaded', function() {
    // Store the original table data for filtering
    const tableRows = Array.from(document.querySelectorAll('#historyTableBody tr'));
    
    // Save all the original rows to our global variable
    originalTableData = tableRows.map(row => {
        const columns = row.querySelectorAll('td');
        
        return {
            element: row.cloneNode(true),
            semester: columns[2].textContent,
            courseCode: columns[4].textContent,
            courseName: columns[5].textContent
        };
    }).filter(item => item !== null);
    
    // Remove the input event listener, only keep the button click
    document.getElementById('semesterSelect').addEventListener('change', filterData);
});

function filterData() {
    const semesterValue = document.getElementById('semesterSelect').value;
    const keywordValue = document.getElementById('keywordInput').value.toLowerCase().trim();
    const tableBody = document.getElementById('historyTableBody');
    
    // Clear the table
    tableBody.innerHTML = '';
    
    // Counter for row numbering
    let counter = 1;
    
    // Filter the rows from our stored original data
    const filteredRows = originalTableData.filter(row => {
        const semesterMatch = semesterValue === '' || row.semester.includes(`${semesterValue}`);
        const keywordMatch = keywordValue === '' || 
            row.courseCode.toLowerCase().includes(keywordValue) || 
            row.courseName.toLowerCase().includes(keywordValue);
        
        return semesterMatch && keywordMatch;
    });
    
    // Add filtered rows to the table
    filteredRows.forEach(row => {
        const newRow = row.element.cloneNode(true);
        const actionCell = newRow.querySelector('.action-column');
        if (actionCell) {
            // Kiểm tra điều kiện của bạn ở đây
            actionCell.style.display = shouldShowAction ? '' : 'none';
        }
        newRow.querySelectorAll('td')[0].textContent = counter++;
        tableBody.appendChild(newRow);
    });
    
    // Show message if no results found
    if (filteredRows.length === 0) {
        const noResultsRow = document.createElement('tr');
        noResultsRow.innerHTML = '<td colspan="10" style="text-align: center;">Không tìm thấy kết quả phù hợp</td>';
        tableBody.appendChild(noResultsRow);
    }
}

function resetFilters() {
    document.getElementById('semesterSelect').value = '';
    document.getElementById('keywordInput').value = '';
    filterData();
}

function showAllData() {
    document.getElementById('semesterSelect').value = '';
    document.getElementById('keywordInput').value = '';
    
    const tableBody = document.getElementById('historyTableBody');
    tableBody.innerHTML = '';
    
    let counter = 1;
    
    originalTableData.forEach(row => {
        const newRow = row.element.cloneNode(true);
        newRow.querySelectorAll('td')[0].textContent = counter++;
        tableBody.appendChild(newRow);
    });
}