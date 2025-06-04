import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getDaysUntil, countBookingsForCourse } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Course {
  id: string;
  title: string;
  startDate: string;
}

interface Booking {
  courseId: string;
}

interface Data {
  courses: Course[];
  bookings: Booking[];
}

const dbPath = path.join(__dirname, "../db.json");
const db: Data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

const updatedCourses = db.courses.filter((course) => {
  const courseBookings = db.bookings.filter((b) => String(b.courseId) === String(course.id));
  const numBookings = courseBookings.length;
  const daysLeft = getDaysUntil(course.startDate);

  if (numBookings < 5 && daysLeft <= 21) {
    console.log(`⚠️ Course "${course.title}" canceled: Only ${numBookings} students and starts in ${daysLeft} days.`);
    return false;
  }

  return true;
});

const updatedDb: Data = {
  ...db,
  courses: updatedCourses,
};

fs.writeFileSync(dbPath, JSON.stringify(updatedDb, null, 2), "utf-8");

console.log("✅ Auto-cancellation check completed.");
