
import { createBooking } from './booking.js';

const loggedInUser = { id: 1 }; 
const courseId = 2; 

try {
  const booking = createBooking(loggedInUser.id, courseId);

  console.log('🎉 Booking ready to send:', booking);
} catch (err) {
  console.error('❌ Booking error:', err);
}
