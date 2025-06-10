import { createUser } from './services.js';

const form = document.querySelector('#registerForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newUser = {
        id: Date.now().toString(),
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value,
        phone: document.querySelector('#phone').value,
        address: document.querySelector('#address').value
    };

    try {
        const user = await createUser(newUser);
        alert('Registration successful!');
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed');
    }
});
