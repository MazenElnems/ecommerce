document.addEventListener('DOMContentLoaded', function() {
    // Stats Click - Toggle active class
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', function() {
            // Remove active from all
            document.querySelectorAll('.stat-card').forEach(c => {
                c.classList.remove('active');
            });
            
            // Add to clicked
            this.classList.add('active');
        });
    });
});