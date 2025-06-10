import { getUserBookings, getCourses, deleteBooking } from './services.js';
import { showLoading, hideLoading } from './main.js';

const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
    window.location.replace('login.html');
}

const bookingsList = document.querySelector('#bookingsList');

async function loadBookings() {
    try {
        showLoading(bookingsList);
        const [bookings, courses] = await Promise.all([
            getUserBookings(user.id),
            getCourses()
        ]);

        if (!bookings || bookings.length === 0) {
            bookingsList.innerHTML = '<p class="no-data">You have no bookings yet</p>';
            return;
        }

        bookingsList.innerHTML = bookings.map(booking => {
            const course = courses.find(c => c.id === booking.courseId);
            if (!course) return '';

            return `
                <div class="booking-card">
                    <div class="card-header">
                        <h3>${course.title}</h3>
                        <button class="delete-btn" data-id="${booking.id}">Cancel Booking</button>
                    </div>
                    <p><strong>Course Number:</strong> ${course.number || 'N/A'}</p>
                    <p><strong>Start Date:</strong> ${new Date(course.startDate).toLocaleDateString()}</p>
                    <p><strong>Duration:</strong> ${course.duration || course.days} ${course.duration ? 'weeks' : 'days'}</p>
                    <p><strong>Teacher:</strong> ${course.teacher || 'Not assigned'}</p>
                    <p><strong>Booked on:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleCancelBooking);
        });
    } catch (error) {
        console.error('Error:', error);
        bookingsList.innerHTML = '<p class="error-message">Failed to load bookings</p>';
    } finally {
        hideLoading(bookingsList);
    }
}

async function handleCancelBooking(e) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    const bookingId = e.target.dataset.id;
    const card = e.target.closest('.booking-card');
    
    try {
        showLoading(card);
        await deleteBooking(bookingId);
        await loadBookings(); 
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to cancel booking');
    }
}

loadBookings();
