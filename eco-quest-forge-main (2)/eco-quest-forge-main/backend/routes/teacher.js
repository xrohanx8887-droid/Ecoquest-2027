const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRoles } = require('../middleware/roles');
const {
  getClasses,
  createClass,
  getSubmissions,
  approveSubmission,
  rejectSubmission,
  createAnnouncement,
  getAnnouncements,
} = require('../controllers/teacherController');

// All teacher routes require auth and teacher/admin role
router.use(auth, requireRoles('teacher', 'admin'));

// Classes
router.get('/classes', getClasses);
router.post('/classes', createClass);

// Submissions
router.get('/submissions', getSubmissions); // optional ?status=pending|approved|rejected
router.post('/submissions/:id/approve', approveSubmission);
router.post('/submissions/:id/reject', rejectSubmission);

// Announcements
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);

module.exports = router;
