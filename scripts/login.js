import { login } from './services.js';

const loginForm = document.querySelector('#loginForm');
const errorMessage = document.createElement('div');
errorMessage.className = 'error-message';
loginForm.appendChild(errorMessage);

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function validateForm(email, password) {
    if (!email || !password) {
        throw new Error('Please fill in all fields');
    }
    if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
    }
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;

    try {
        validateForm(email, password);
        
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';

        const user = await login(email, password);
        
        if (user) {
            localStorage.setItem('user', JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: email === 'admin@example.com'
            }));

            if (email === 'admin@example.com') {
                window.location.replace('admin.html');
            } else {
                window.location.replace('index.html');
            }
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'Login failed. Please try again.');
    } finally {
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
});
