import { BASE_URL } from './config.js';

const apiUrl = `${BASE_URL}/courses`;

const urlParams = new URLSearchParams(window.location.search);
const courseId = Number(urlParams.get('id')); 

async function loadCourseDetails() {
  try {
    const response = await fetch(`${apiUrl}/${courseId}`);
    const course = await response.json();

    const detailDiv = document.getElementById('course-detail');
    detailDiv.className = 'course-card';

    detailDiv.innerHTML = `
      <div class="course-header">
        <h2>${course.title}</h2>
        <span class="course-number">#${course.number}</span>
        ${course.rating ? `<span class="rating">⭐ ${course.rating}</span>` : ''}
      </div>

      <div class="course-info">
        <div class="info-group">
          <label>Duration:</label>
          <span>${course.days} days</span>
        </div>

        <div class="info-group">
          <label>Start Date:</label>
          <span>${new Date(course.startDate).toLocaleDateString()}</span>
        </div>

        <div class="info-group">
          <label>Teacher:</label>
          <span>${course.teacher}</span>
        </div>

        <div class="info-group">
          <label>Course Type:</label>
          <div class="type-tags">
            ${course.type.map(type => `<span class="tag">${type}</span>`).join('')}
          </div>
        </div>
      </div>

      <button id="book-btn" class="nav-button">Book Now</button>
    `;

    // button "Book Now"
    const bookButton = document.getElementById('book-btn');
    bookButton.addEventListener('click', async () => {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

      if (!loggedInUser) {
        alert('Please login to book a course.');
        window.location.href = 'login.html';
        return;
      }

      try {
        const booking = {
          userId: loggedInUser.id,
          courseId: course.id,
          bookingDate: new Date().toISOString()
        };

        const res = await fetch(`${BASE_URL}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(booking)
        });

        if (res.ok) {
          alert('Course booked successfully!');
          window.location.href = 'my-bookings.html';
        } else {
          alert('Failed to book course.');
        }
      } catch (err) {
        console.error('❌ Booking error:', err);
        alert('An error occurred while booking the course.');
      }
    });

  } catch (error) {
    console.error('❌ Error loading course details:', error);
    const detailDiv = document.getElementById('course-detail');
    detailDiv.innerHTML = '<p class="error">Error loading course details. Please try again later.</p>';
  }
}

loadCourseDetails();
