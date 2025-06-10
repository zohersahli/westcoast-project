const nav = document.querySelector('nav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const userNav = document.querySelector('#userNav');
const mainNav = document.querySelector('.main-nav');

function showLoading(element) {
    if (!element) return;
    element.classList.add('loading');
    const loader = document.createElement('div');
    loader.className = 'loader';
    element.appendChild(loader);
}

function hideLoading(element) {
    if (!element) return;
    element.classList.remove('loading');
    const loader = element.querySelector('.loader');
    if (loader) {
        loader.remove();
    }
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.classList.contains('active');
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');
    });

    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open menu');
        }
    });
}

if (nav) {
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && navLinks && navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open menu');
        }
    });
}

function updateNavigation() {
    if (!userNav || !mainNav) return;

    const userData = localStorage.getItem('user');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            const isAdmin = user.email === 'admin@example.com';
            
            userNav.innerHTML = `
                <span class="user-name">Welcome, ${user.name}</span>
            `;

            mainNav.innerHTML = `
                <a href="index.html">Home</a>
                <a href="my-bookings.html">My Bookings</a>
                ${isAdmin ? '<a href="admin.html" class="admin-link">Admin Panel</a>' : ''}
                <button class="logout-btn">Logout</button>
            `;

            const logoutBtn = mainNav.querySelector('.logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('user');
                    window.location.href = 'index.html';
                });
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('user'); 
            updateNavigation(); 
        }
    } else {
        userNav.innerHTML = '';
        mainNav.innerHTML = `
            <a href="index.html">Home</a>
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    }
}

updateNavigation();

window.addEventListener('storage', (e) => {
    if (e.key === 'user') {
        updateNavigation();
    }
});

export { showLoading, hideLoading };
