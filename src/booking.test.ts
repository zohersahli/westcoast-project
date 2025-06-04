import { createBooking } from './booking';

describe('createBooking', () => {
  it('should create a valid booking object', () => {
    const booking = createBooking(1, 2);

    expect(booking.userId).toBe(1);
    expect(booking.courseId).toBe(2);
    expect(booking.bookingDate).toMatch(/^\d{4}-\d{2}-\d{2}$/); //YYYY-MM-DD
  });

  it('should throw an error if userId is missing', () => {
    expect(() => createBooking(0, 2)).toThrow();
  });

  it('should throw an error if courseId is missing', () => {
    expect(() => createBooking(1, 0)).toThrow();
  });
});
