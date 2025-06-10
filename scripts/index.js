import { getCourses } from './services.js';
import { showLoading, hideLoading } from './main.js';

const coursesList = document.querySelector('#coursesList');

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

function truncateText(text, maxLength = 120) {
    if (!text) {
        return 'Course details will be available soon.';
    }
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

async function displayCourses() {
    if (!coursesList) return;

    try {
        showLoading(coursesList);
        const courses = await getCourses();
        
        if (!courses || courses.length === 0) {
            coursesList.innerHTML = '<p class="no-courses">No courses available at the moment</p>';
            return;
        }

        coursesList.innerHTML = courses.map(course => `
            <div class="course-card">
                <div class="course-header">
                    <h2>${course.title || 'Untitled Course'}</h2>
                    <span class="course-duration">${course.duration || course.days || 'N/A'} ${course.duration ? 'weeks' : 'days'}</span>
                </div>
                <div class="course-content">
                    <p class="course-description">${truncateText(course.description)}</p>
                    <div class="course-meta">
                        <p><strong>Start Date:</strong> ${formatDate(course.startDate)}</p>
                        <p><strong>Teacher:</strong> ${course.teacher || 'To be announced'}</p>
                        ${course.rating ? `<p><strong>Rating:</strong> ${course.rating}/5</p>` : ''}
                    </div>
                    <a href="courseDetail.html?id=${course.id}" class="view-details">View Details</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        coursesList.innerHTML = `
            <div class="error-message">
                <p>Error loading courses</p>
                <button onclick="window.location.reload()">Try Again</button>
            </div>
        `;
    } finally {
        hideLoading(coursesList);
    }
}

displayCourses(); 