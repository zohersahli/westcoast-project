import { getCourse, getBookings, createBooking } from './services.js';
import { showLoading, hideLoading } from './main.js';

const courseDetails = document.querySelector('#courseDetails');
const bookCourseBtn = document.querySelector('#bookCourseBtn');

const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');
const user = JSON.parse(localStorage.getItem('user'));

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return 'Date not available';
    }
}

async function displayCourseDetails() {
    if (!courseId) {
        courseDetails.innerHTML = '<p class="error-message">No course ID provided</p>';
        return;
    }

    try {
        showLoading(courseDetails);
        const course = await getCourse(courseId);
        
        if (!course) {
            courseDetails.innerHTML = '<p class="error-message">Course not found</p>';
            return;
        }

        courseDetails.innerHTML = `
            <div class="course-detail-container">
                <h1>${course.title || 'Untitled Course'}</h1>
                <div class="course-info">
                    <div class="info-section">
                        <h2>Course Description</h2>
                        <p>${course.description || 'No description available'}</p>
                    </div>
                    <div class="info-section">
                        <h2>Course Details</h2>
                        <p><strong>Duration:</strong> ${course.duration || course.days || 'Not specified'} ${course.duration ? 'weeks' : 'days'}</p>
                        <p><strong>Start Date:</strong> ${formatDate(course.startDate)}</p>
                        <p><strong>Status:</strong> <span class="status-badge ${course.status?.toLowerCase() || 'open'}">${course.status || 'Open for Registration'}</span></p>
                    </div>
                </div>
            </div>
        `;

        if (user) {
            showLoading(bookCourseBtn);
            const bookings = await getBookings(courseId);
            const hasBooked = bookings.some(booking => booking.userId === user.id);
            
            if (!hasBooked) {
                bookCourseBtn.style.display = 'block';
            }
            hideLoading(bookCourseBtn);
        }
    } catch (error) {
        console.error('Error:', error);
        courseDetails.innerHTML = `
            <div class="error-message">
                <p>Error loading course details</p>
                <button onclick="window.location.reload()">Try Again</button>
            </div>
        `;
    } finally {
        hideLoading(courseDetails);
    }
}

if (bookCourseBtn) {
    bookCourseBtn.addEventListener('click', async () => {
        if (!user) {
            alert('Please login to book a course');
            window.location.href = `login.html?redirect=courseDetail.html?id=${courseId}`;
            return;
        }

        try {
            showLoading(bookCourseBtn);
            const booking = {
                id: Date.now().toString(),
                courseId: courseId,
                userId: user.id,
                bookingDate: new Date().toISOString()
            };

            await createBooking(booking);
            alert('Course booked successfully!');
            window.location.href = 'my-bookings.html';
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to book course. Please try again.');
        } finally {
            hideLoading(bookCourseBtn);
        }
    });
}

if (courseDetails) {
    displayCourseDetails();
}


