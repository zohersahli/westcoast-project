import { BASE_URL } from './config.js';

const apiUrl = `${BASE_URL}/users`;

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(apiUrl);
    const users = await response.json();

    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
      alert('Login successful!');
      window.location.href = 'index.html';
    } else {
      document.getElementById('login-message').textContent = 'Invalid email or password.';
    }
  } catch (error) {
    console.error('❌ Login error:', error);
  }
});
