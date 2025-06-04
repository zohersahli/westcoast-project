// Navigation component functionality
export function initializeNavigation() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const userLinks = document.getElementById('userLinks');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Set active nav link based on current page
  const currentPath = window.location.pathname;
  const navLinksElements = document.querySelectorAll('#navLinks a');
  navLinksElements.forEach(link => {
    if (link.getAttribute('href') === currentPath.split('/').pop()) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Toggle mobile menu
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', 
        navToggle.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
      );
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Handle user authentication links
  if (userLinks) {
    if (user) {
      let links = `
        <a href="my-bookings.html">My Bookings</a>
        <button id="logoutBtn" class="nav-button">Logout</button>
      `;

      if (user.email === 'admin@example.com') {
        links += `<a href="admin.html">Admin Panel</a>`;
      }

      userLinks.innerHTML = links;

      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('loggedInUser');
          window.location.href = 'login.html';
        });
      }
    } else {
      userLinks.innerHTML = `
        <a href="login.html">Login</a>
        <a href="register.html">Register</a>
      `;
    }
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeNavigation); 