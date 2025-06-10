import { getCourses, getBookings, getUsers, deleteCourse, deleteBooking, addCourse } from './services.js';
import { showLoading, hideLoading } from './main.js';

// Check admin access
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (!user.email || user.email !== 'admin@example.com') {
    window.location.replace('login.html');
    throw new Error('Unauthorized access');
}

const addCourseForm = document.querySelector('#addCourseForm');
const bookingsList = document.querySelector('#bookingsList');
const usersList = document.querySelector('#usersList');
const coursesList = document.querySelector('#coursesList');
const cancelButton = document.getElementById('cancelEdit');

function resetForm() {
    addCourseForm.reset();
    delete addCourseForm.dataset.editingId;
    document.querySelector('#courseForm h2').textContent = 'Add New Course';
    document.querySelector('#addCourseForm button[type="submit"]').textContent = 'Add Course';
    cancelButton.style.display = 'none';
}

cancelButton.addEventListener('click', resetForm);

async function loadCourses() {
    try {
        showLoading(coursesList);
        const courses = await getCourses();
        
        if (!courses || courses.length === 0) {
            coursesList.innerHTML = '<p class="no-data">No courses available</p>';
            return;
        }

        coursesList.innerHTML = courses.map(course => `
            <div class="admin-card course-card">
                <div class="card-header">
                    <h3>${course.title}</h3>
                    <div class="card-actions">
                        <button class="edit-btn" data-id="${course.id}">Edit</button>
                        <button class="delete-btn" data-id="${course.id}">Delete</button>
                    </div>
                </div>
                <p><strong>Description:</strong> ${course.description || 'No description'}</p>
                <p><strong>Duration:</strong> ${course.duration || course.days} ${course.duration ? 'weeks' : 'days'}</p>
                <p><strong>Start Date:</strong> ${new Date(course.startDate).toLocaleDateString()}</p>
                <p><strong>Teacher:</strong> ${course.teacher || 'Not assigned'}</p>
            </div>
        `).join('');

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEditCourse);
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteCourse);
        });
    } catch (error) {
        console.error('Error:', error);
        coursesList.innerHTML = '<p class="error-message">Failed to load courses</p>';
    } finally {
        hideLoading(coursesList);
    }
}

async function loadBookings() {
    try {
        showLoading(bookingsList);
        const [courses, users] = await Promise.all([
            getCourses(),
            getUsers()
        ]);
        
        const bookingsPromises = courses.map(course => getBookings(course.id));
        const allBookings = await Promise.all(bookingsPromises);
        const bookings = allBookings.flat();
        
        if (!bookings || bookings.length === 0) {
            bookingsList.innerHTML = '<p class="no-data">No bookings found</p>';
            return;
        }

        bookingsList.innerHTML = bookings.map(booking => {
            const course = courses.find(c => c.id === booking.courseId);
            const bookingUser = users.find(u => u.id === booking.userId.toString());
            if (!course) return '';

            return `
                <div class="admin-card booking-card">
                    <div class="card-header">
                        <h3>Booking: ${course.title}</h3>
                        <button class="delete-btn" data-id="${booking.id}">Cancel Booking</button>
                    </div>
                    <div class="user-info">
                        <p><strong>User ID:</strong> ${booking.userId}</p>
                        <p><strong>User Name:</strong> ${bookingUser ? bookingUser.name : 'Unknown User'}</p>
                        <p><strong>User Email:</strong> ${bookingUser ? bookingUser.email : 'N/A'}</p>
                    </div>
                    <div class="booking-details">
                        <p><strong>Booked Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                        <p><strong>Course Start:</strong> ${new Date(course.startDate).toLocaleDateString()}</p>
                        <p><strong>Duration:</strong> ${course.duration || course.days} ${course.duration ? 'weeks' : 'days'}</p>
                    </div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.booking-card .delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteBooking);
        });
    } catch (error) {
        console.error('Error:', error);
        bookingsList.innerHTML = '<p class="error-message">Failed to load bookings</p>';
    } finally {
        hideLoading(bookingsList);
    }
}

async function loadUsers() {
    try {
        showLoading(usersList);
        const users = await getUsers();
        
        if (!users || users.length === 0) {
            usersList.innerHTML = '<p class="no-data">No users found</p>';
            return;
        }

        usersList.innerHTML = users.map(user => `
            <div class="admin-card user-card">
                <h3>${user.name}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
                <p><strong>Address:</strong> ${user.address || 'Not provided'}</p>
                ${user.email === 'admin@example.com' ? '<span class="admin-badge">Admin</span>' : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        usersList.innerHTML = '<p class="error-message">Failed to load users</p>';
    } finally {
        hideLoading(usersList);
    }
}

async function handleDeleteCourse(e) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    const courseId = e.target.dataset.id;
    try {
        showLoading(e.target.closest('.course-card'));
        await deleteCourse(courseId);
        await loadCourses(); 
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete course');
    }
}

async function handleDeleteBooking(e) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    const bookingId = e.target.dataset.id;
    try {
        showLoading(e.target.closest('.booking-card'));
        await deleteBooking(bookingId);
        await loadBookings(); 
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to cancel booking');
    }
}

async function handleEditCourse(e) {
    const courseId = e.target.dataset.id;
    
    try {
        const courses = await getCourses();
        const course = courses.find(c => c.id.toString() === courseId);
        
        if (!course) {
            alert('Course not found');
            return;
        }

        document.getElementById('title').value = course.title;
        document.getElementById('description').value = course.description || '';
        document.getElementById('duration').value = course.duration || course.days || '';
        document.getElementById('startDate').value = course.startDate ? course.startDate.split('T')[0] : '';
        document.getElementById('teacher').value = course.teacher || '';
        document.getElementById('type').value = course.type || '';

        const formTitle = document.querySelector('#courseForm h2');
        const submitButton = document.querySelector('#addCourseForm button[type="submit"]');
        const cancelButton = document.getElementById('cancelEdit');
        
        formTitle.textContent = 'Edit Course';
        submitButton.textContent = 'Update Course';
        cancelButton.style.display = 'inline-block';

        addCourseForm.dataset.editingId = courseId;

        document.getElementById('courseForm').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load course data');
    }
}

addCourseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addCourseForm);
    const isEditing = addCourseForm.dataset.editingId;
    
    const courseData = {
        title: formData.get('title'),
        description: formData.get('description'),
        duration: parseInt(formData.get('duration')),
        startDate: formData.get('startDate'),
        teacher: formData.get('teacher') || 'To be assigned',
        type: formData.get('type'),
        rating: 0
    };

    if (!isEditing) {
        courseData.id = Date.now().toString();
    }

    try {
        showLoading(addCourseForm);
        
        if (isEditing) {
            const response = await fetch(`http://localhost:3000/courses/${isEditing}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...courseData, id: isEditing })
            });
            
            if (!response.ok) throw new Error('Failed to update course');
            alert('Course updated successfully!');
        } else {
            // Add new course
            await addCourse(courseData);
            alert('Course added successfully!');
        }
        
        // Reset form and UI
        resetForm();
        
        await loadCourses(); // Reload courses
        
    } catch (error) {
        console.error('Error:', error);
        alert(isEditing ? 'Failed to update course' : 'Failed to add course');
    } finally {
        hideLoading(addCourseForm);
    }
});

loadCourses();
loadBookings();
loadUsers();
