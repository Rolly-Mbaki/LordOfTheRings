function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Function to show or hide the button based on scroll position
function toggleScrollTopButton() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (window.scrollY > 100) { // Show the button after scrolling down 100px
        scrollTopBtn.style.display = 'block';
    } else {
        scrollTopBtn.style.display = 'none';
    }
}

// Add an event listener for the scroll event
window.addEventListener('scroll', toggleScrollTopButton);

// Initial check in case the page is not scrolled to the top when loaded
document.addEventListener('DOMContentLoaded', toggleScrollTopButton);