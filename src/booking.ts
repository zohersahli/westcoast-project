export interface Booking {
  userId: number;
  courseId: number;
  bookingDate: string;
}

export function createBooking(userId: number, courseId: number): Booking {
  if (!userId || !courseId) {
    throw new Error('Missing user or course ID');
  }

  const today = new Date().toISOString().split('T')[0];

  return {
    userId,
    courseId,
    bookingDate: today
  };
}
