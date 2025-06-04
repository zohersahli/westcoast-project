import { BASE_URL } from './config.js';

const apiUrl = `${BASE_URL}/users`;

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const newUser = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value
  };

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    if (res.ok) {
      const savedUser = await res.json();
      localStorage.setItem('loggedInUser', JSON.stringify(savedUser));
      alert('Registration successful! You are now logged in.');
      window.location.href = 'index.html';
    } else {
      document.getElementById('register-message').textContent = 'Failed to register.';
    }
  } catch (err) {
    console.error('❌ Registration error:', err);
  }
});
