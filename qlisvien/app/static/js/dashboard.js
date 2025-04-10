document.addEventListener('DOMContentLoaded', function() {
// Toggle dropdown menu
    const avatar = document.querySelector('.avatar2');
    const dropdown = document.getElementById('dropdownMenu');

    if (avatar && dropdown) {
        avatar.addEventListener('click', function() {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!dropdown.contains(event.target) && !avatar.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Toggle sidebar on mobile
    const toggleBtn = document.querySelector('.toggle-menu');
    const sidebar = document.querySelector('.sidebar');
    
    if(toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Xử lý notification
    const notification = document.querySelector('.notification');
    if (notification) {
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }

    // Animate stats numbers
    const statNumbers = document.querySelectorAll('.stat-info h3');
    statNumbers.forEach(number => {
        const finalNumber = parseInt(number.textContent);
        let currentNumber = 0;
        const increment = finalNumber / 50;
        const duration = 1500;
        const interval = duration / 50;
        
        const counter = setInterval(() => {
            currentNumber += increment;
            if(currentNumber >= finalNumber) {
                number.textContent = finalNumber.toLocaleString();
                clearInterval(counter);
            } else {
                number.textContent = Math.floor(currentNumber).toLocaleString();
            }
        }, interval);
    });
});