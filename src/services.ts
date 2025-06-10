export interface Course {
    id: string;
    title: string;
    number: string;
    days: number;
    type: string[];
    startDate: string;
    rating: number;
    teacher: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}

export interface Booking {
    id: string;
    userId: string;
    courseId: string;
    bookingDate: string;
}

const baseUrl = 'http://localhost:3000';

export async function getCourses() {
    const response = await fetch(`${baseUrl}/courses`);
    return response.json();
}

export async function getCourse(id: string) {
    const response = await fetch(`${baseUrl}/courses/${id}`);
    return response.json();
}

export async function addCourse(course: Course) {
    const response = await fetch(`${baseUrl}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
    });
    return response.json();
}

export async function login(email: string, password: string) {
    const response = await fetch(`${baseUrl}/users`);
    const users: User[] = await response.json();
    return users.find((user: User) => user.email === email && user.password === password) || null;
}

export async function register(user: User) {
    const response = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    return response.json();
}

export async function addBooking(booking: Booking) {
    const response = await fetch(`${baseUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
    });
    return response.json();
}

export async function getUserBookings(userId: string) {
    const response = await fetch(`${baseUrl}/bookings?userId=${userId}`);
    return response.json();
}

export async function getCourseBookings(courseId: string) {
    const response = await fetch(`${baseUrl}/bookings?courseId=${courseId}`);
    return response.json();
}

export async function updateCourse(id: string, course: Partial<Course>) {
    const response = await fetch(`${baseUrl}/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
    });
    return response.json();
}

export async function deleteBooking(bookingId: string) {
    const response = await fetch(`${baseUrl}/bookings/${bookingId}`, {
        method: 'DELETE'
    });
    return response.ok;
}

export async function getUsers() {
    const response = await fetch(`${baseUrl}/users`);
    return response.json();
}

export async function getBookings(courseId?: string) {
    const url = courseId ? `${baseUrl}/bookings?courseId=${courseId}` : `${baseUrl}/bookings`;
    const response = await fetch(url);
    return response.json();
}

export async function createBooking(booking: Booking) {
    const response = await fetch(`${baseUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
    });
    return response.json();
} 