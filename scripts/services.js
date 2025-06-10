const API_URL = 'http://localhost:3000';

async function handleResponse(response, errorMessage) {
    if (!response.ok) {
        throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// Course functions
export async function getCourses() {
    try {
        const response = await fetch(`${API_URL}/courses`);
        return await handleResponse(response, 'Failed to fetch courses');
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}

export async function getCourse(id) {
    try {
        const response = await fetch(`${API_URL}/courses/${id}`);
        return await handleResponse(response, `Course with ID ${id} not found`);
    } catch (error) {
        console.error(`Error fetching course ${id}:`, error);
        throw error;
    }
}

export async function createCourse(course) {
    try {
        const response = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(course),
        });
        return await handleResponse(response, 'Failed to create course');
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
}

export async function deleteCourse(id) {
    try {
        const response = await fetch(`${API_URL}/courses/${id}`, {
            method: 'DELETE',
        });
        return await handleResponse(response, `Failed to delete course ${id}`);
    } catch (error) {
        console.error(`Error deleting course ${id}:`, error);
        throw error;
    }
}

// Booking functions
export async function getBookings(courseId) {
    try {
        const response = await fetch(`${API_URL}/bookings?courseId=${courseId}`);
        return await handleResponse(response, `Failed to fetch bookings for course ${courseId}`);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
}

export async function createBooking(booking) {
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking),
        });
        return await handleResponse(response, 'Failed to create booking');
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

export async function deleteBooking(id) {
    try {
        const response = await fetch(`${API_URL}/bookings/${id}`, {
            method: 'DELETE',
        });
        return await handleResponse(response, `Failed to delete booking ${id}`);
    } catch (error) {
        console.error(`Error deleting booking ${id}:`, error);
        throw error;
    }
}

// User functions
export async function getUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        return await handleResponse(response, 'Failed to fetch users');
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export async function createUser(user) {
    try {
        // Hash password before sending (in a real app, use proper password hashing)
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        return await handleResponse(response, 'Failed to create user');
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function addCourse(course) {
    const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
    });
    return response.json();
}

export async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await handleResponse(response, 'Failed to authenticate');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid email or password');
        }
        
        // Create user data with admin flag
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.email === 'admin@example.com'
        };
        
        return userData;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

export async function register(user) {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    return response.json();
}

export async function getUserBookings(userId) {
    try {
        const response = await fetch(`${API_URL}/bookings?userId=${userId}`);
        return await handleResponse(response, `Failed to fetch bookings for user ${userId}`);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
    }
}

export async function getCourseBookings(courseId) {
    try {
        const response = await fetch(`${API_URL}/bookings?courseId=${courseId}`);
        return await handleResponse(response, `Failed to fetch bookings for course ${courseId}`);
    } catch (error) {
        console.error('Error fetching course bookings:', error);
        throw error;
    }
}

// Add admin check utility function
export function checkAdminAccess() {
    const userData = localStorage.getItem('user');
    if (!userData) {
        window.location.href = 'login.html';
        return false;
    }

    const user = JSON.parse(userData);
    if (!user.isAdmin) {
        window.location.href = 'index.html';
        return false;
    }

    return true;
} 