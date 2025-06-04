import { BASE_URL } from './config.js';

const bookingsUrl = `${BASE_URL}/bookings`;
const coursesUrl = `${BASE_URL}/courses`;

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
if (!loggedInUser) {
  alert('You must be logged in to view your bookings.');
  window.location.href = 'login.html';
}

async function loadMyBookings() {
  try {
    const [bookingsRes, coursesRes] = await Promise.all([
      fetch(bookingsUrl),
      fetch(coursesUrl)
    ]);

    const bookings = await bookingsRes.json();
    const courses = await coursesRes.json();

    const myBookings = bookings.filter(b => Number(b.userId) === Number(loggedInUser.id));
    const container = document.getElementById('my-bookings-container');

    if (myBookings.length === 0) {
      container.innerHTML = '<p>You have no bookings yet.</p>';
      return;
    }

    myBookings.forEach(b => {
      const course = courses.find(c => Number(c.id) === Number(b.courseId));
      const div = document.createElement('div');
      div.className = 'course-card';
      div.innerHTML = `
        <h3>${course?.title || 'Unknown Course'}</h3>
        <p><strong>Date:</strong> ${course?.startDate || 'N/A'}</p>
        <p><strong>Booked on:</strong> ${b.bookingDate}</p>
      `;
      container.appendChild(div);
    });

  } catch (error) {
    console.error('❌ Failed to load bookings:', error);
  }
}

loadMyBookings();
