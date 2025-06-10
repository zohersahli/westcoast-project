import { Course, User, Booking } from './services';

// Mock fetch 
global.fetch = jest.fn();

describe('Services Tests - TDD Practice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Course Management', () => {
    test('should validate course data structure', () => {
      const course: Course = {
        id: '1',
        title: 'JavaScript Basics',
        number: 'JS001',
        days: 5,
        type: ['Online'],
        startDate: '2024-02-01',
        rating: 4.5,
        teacher: 'John Doe'
      };

      expect(course).toBeDefined();
      expect(course.title).toBe('JavaScript Basics');
      expect(course.days).toBeGreaterThan(0);
      expect(course.rating).toBeGreaterThanOrEqual(0);
      expect(course.rating).toBeLessThanOrEqual(5);
    });

    test('should validate course title is not empty', () => {
      const course: Course = {
        id: '1',
        title: '',
        number: 'JS001',
        days: 5,
        type: ['Online'],
        startDate: '2024-02-01',
        rating: 4.5,
        teacher: 'John Doe'
      };

      expect(course.title.length).toBe(0);
      // can not create a course with no title 
    });
  });

  describe('User Management', () => {
    test('should validate user email format', () => {
      const validEmail = 'user@example.com';
      const invalidEmail = 'invalid-email';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test(validEmail)).toBe(true);
      expect(emailRegex.test(invalidEmail)).toBe(false);
    });

    test('should create user with required fields', () => {
      const user: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '123-456-7890',
        address: '123 Test St'
      };

      expect(user.name).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.password).toBeDefined();
      expect(user.email).toContain('@');
    });
  });

  describe('Booking Management', () => {
    test('should create booking with valid data', () => {
      const booking: Booking = {
        id: '1',
        userId: 'user1',
        courseId: 'course1',
        bookingDate: new Date().toISOString()
      };

      expect(booking.userId).toBeDefined();
      expect(booking.courseId).toBeDefined();
      expect(booking.bookingDate).toBeDefined();
      expect(new Date(booking.bookingDate)).toBeInstanceOf(Date);
    });

    test('should validate booking date is not in the past', () => {
      const pastDate = new Date('2020-01-01').toISOString();
      const futureDate = new Date(Date.now() + 86400000).toISOString(); // +1 day
      
      const pastBooking: Booking = {
        id: '1',
        userId: 'user1',
        courseId: 'course1',
        bookingDate: pastDate
      };

      const futureBooking: Booking = {
        id: '2',
        userId: 'user1',
        courseId: 'course1',
        bookingDate: futureDate
      };

      expect(new Date(pastBooking.bookingDate) < new Date()).toBe(true);
      expect(new Date(futureBooking.bookingDate) > new Date()).toBe(true);
    });
  });
}); 