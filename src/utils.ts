export function getDaysUntil(startDate: string): number {
  const today = new Date();
  const start = new Date(startDate);
  const diffInTime = start.getTime() - today.getTime();
  const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
  return diffInDays;
}

export function countBookingsForCourse(
  courseId: string | number,
  bookings: { courseId: string | number }[]
): number {
  return bookings.filter(
    (booking) => String(booking.courseId) === String(courseId)
  ).length;
}
