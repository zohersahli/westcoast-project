import { BASE_URL } from './config.js';

const apiUrl = `${BASE_URL}/courses`;

// loadCourses and show them
async function loadCourses() {
  try {
    const response = await fetch(apiUrl);
    const courses = await response.json();

    const container = document.getElementById('courses-container');

    courses.forEach(course => {
      const card = document.createElement('div');
      card.classList.add('course-card');

      
      card.innerHTML = `
        <h3>${course.title}</h3>
        <p><strong>Days:</strong> ${course.days}</p>
        <p><strong>Type:</strong> ${course.type.join(', ')}</p>
        <a href="course.html?id=${course.id}">🔍 View Details</a>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error('⚠️ Error loading courses:', error);
  }
}

loadCourses();
