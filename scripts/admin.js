import { BASE_URL } from './config.js';

const coursesUrl = `${BASE_URL}/courses`;
const bookingsUrl = `${BASE_URL}/bookings`;
const usersUrl = `${BASE_URL}/users`;

// Add New Course
document.getElementById('add-course-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const course = {
    title: document.getElementById('title').value,
    number: document.getElementById('number').value,
    days: parseInt(document.getElementById('days').value),
    type: document.getElementById('type').value.split(',').map(t => t.trim()),
    startDate: document.getElementById('startDate').value,
    teacher: document.getElementById('teacher').value,
    rating: parseFloat(document.getElementById('rating').value || 0)
  };

  try {
    const res = await fetch(coursesUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });

    if (res.ok) {
      alert('Course added!');
      document.getElementById('add-course-form').reset();
    } else {
      alert('Failed to add course.');
    }
  } catch (err) {
    console.error('❌ Error adding course:', err);
  }
});

// Load Bookings
async function loadBookings() {
  try {
    const [bookingsRes, usersRes, coursesRes] = await Promise.all([
      fetch(bookingsUrl),
      fetch(usersUrl),
      fetch(coursesUrl)
    ]);

    const bookings = await bookingsRes.json();
    const users = await usersRes.json();
    const courses = await coursesRes.json();

    const container = document.getElementById('booking-list');

    if (!container) return;
    if (bookings.length === 0) {
      container.innerHTML = '<p>No bookings yet.</p>';
      return;
    }

    bookings.forEach(b => {
      const user = users.find(u => String(u.id) === String(b.userId));
      const course = courses.find(c => String(c.id) === String(b.courseId));

      const div = document.createElement('div');
      div.className = 'course-card';
      div.innerHTML = `
        <h3>${course?.title || 'Unknown Course'}</h3>
        <p><strong>Booked by:</strong> ${user?.name || 'Unknown User'}</p>
        <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
        <p><strong>Date:</strong> ${b.bookingDate}</p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('❌ Error loading bookings:', error);
  }
}

// Load Users
async function loadUsers() {
  try {
    const res = await fetch(usersUrl);
    const users = await res.json();

    const container = document.getElementById('user-list');
    if (!container) return;

    users.forEach(user => {
      const div = document.createElement('div');
      div.className = 'user-card';
      div.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Address:</strong> ${user.address}</p>
        <hr />
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('❌ Error loading users:', err);
  }
}

// Auto Cancel Courses
document.getElementById("run-auto-cancel")?.addEventListener("click", async () => {
  const statusEl = document.getElementById("cancel-status");
  if (!statusEl) return;

  statusEl.textContent = "⏳ Checking courses...";

  try {
    const [coursesRes, bookingsRes] = await Promise.all([
      fetch(coursesUrl),
      fetch(bookingsUrl),
    ]);

    const courses = await coursesRes.json();
    const bookings = await bookingsRes.json();

    const today = new Date();
    let cancelled = 0;

    for (const course of courses) {
      const courseBookings = bookings.filter(
        (b) => String(b.courseId) === String(course.id)
      );
      const count = courseBookings.length;

      const diffInDays =
        (new Date(course.startDate).getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24);

      if (count < 5 && diffInDays <= 21) {
        await fetch(`${coursesUrl}/${course.id}`, { method: "DELETE" });
        cancelled++;
      }
    }

    statusEl.textContent = `✅ ${cancelled} course(s) cancelled due to low enrollment.`;
  } catch (err) {
    console.error("Auto cancel error:", err);
    statusEl.textContent = "❌ Error while checking courses.";
  }
});

// Initial load
loadUsers();
loadBookings();
