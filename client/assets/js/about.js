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
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileMenuOverlay');
const closeBtn = document.getElementById('closeMobileMenu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileMenuBtn.classList.add('active'); // HIDE BUTTON
});
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
}

if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
     mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    mobileMenuBtn.classList.remove('active'); // SHOW BUTTON
}

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});