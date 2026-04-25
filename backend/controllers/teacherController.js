const ClassModel = require('../models/Class');
const Submission = require('../models/Submission');
const Announcement = require('../models/Announcement');
const User = require('../models/User');

// Helper to compute last 7 days date
const sevenDaysAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d;
};

// GET /api/teacher/classes
async function getClasses(req, res) {
  try {
    const teacherId = req.user._id;
    const classes = await ClassModel.find({ teacher: teacherId }).lean();

    // compute weekly eco actions per class (submissions in last 7 days)
    const results = await Promise.all(
      classes.map(async (cls) => {
        const weeklyEcoActions = await Submission.countDocuments({
          teacher: teacherId,
          class: cls._id,
          createdAt: { $gte: sevenDaysAgo() },
        });
        return {
          id: cls._id,
          name: cls.name,
          students: cls.students?.length || 0,
          weeklyEcoActions,
        };
      })
    );

    res.json({ success: true, classes: results });
  } catch (err) {
    console.error('getClasses error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch classes' });
  }
}

// POST /api/teacher/classes { name }
async function createClass(req, res) {
  try {
    const teacherId = req.user._id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Class name is required' });

    const cls = await ClassModel.create({ name, teacher: teacherId, students: [] });
    res.status(201).json({ success: true, class: { id: cls._id, name: cls.name, students: 0, weeklyEcoActions: 0 } });
  } catch (err) {
    console.error('createClass error:', err);
    res.status(500).json({ success: false, message: 'Failed to create class' });
  }
}

// GET /api/teacher/submissions?status=pending
async function getSubmissions(req, res) {
  try {
    const teacherId = req.user._id;
    const { status } = req.query;
    const query = { teacher: teacherId };
    if (status) query.status = status;
    const subs = await Submission.find(query)
      .populate('student', 'name email')
      .populate('class', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const out = subs.map((s) => ({
      id: s._id,
      student: s.student?.name || 'Unknown',
      studentEmail: s.student?.email,
      class: s.class?.name || '—',
      action: s.action,
      points: s.points,
      status: s.status,
      date: s.createdAt,
    }));

    res.json({ success: true, submissions: out });
  } catch (err) {
    console.error('getSubmissions error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
}

// POST /api/teacher/submissions/:id/approve
async function approveSubmission(req, res) {
  try {
    const teacherId = req.user._id;
    const { id } = req.params;
    const sub = await Submission.findOne({ _id: id, teacher: teacherId });
    if (!sub) return res.status(404).json({ success: false, message: 'Submission not found' });

    sub.status = 'approved';
    await sub.save();

    // Reward student ecoPoints
    if (sub.student) {
      const student = await User.findById(sub.student);
      if (student) {
        student.ecoPoints = (student.ecoPoints || 0) + (sub.points || 0);
        await student.save();
      }
    }

    res.json({ success: true, message: 'Submission approved' });
  } catch (err) {
    console.error('approveSubmission error:', err);
    res.status(500).json({ success: false, message: 'Failed to approve submission' });
  }
}

// POST /api/teacher/submissions/:id/reject
async function rejectSubmission(req, res) {
  try {
    const teacherId = req.user._id;
    const { id } = req.params;
    const sub = await Submission.findOne({ _id: id, teacher: teacherId });
    if (!sub) return res.status(404).json({ success: false, message: 'Submission not found' });

    sub.status = 'rejected';
    await sub.save();

    res.json({ success: true, message: 'Submission rejected' });
  } catch (err) {
    console.error('rejectSubmission error:', err);
    res.status(500).json({ success: false, message: 'Failed to reject submission' });
  }
}

// POST /api/teacher/announcements { title, message, date, classId? }
async function createAnnouncement(req, res) {
  try {
    const teacherId = req.user._id;
    const { title, message, date, classId } = req.body;
    if (!title || !message) return res.status(400).json({ success: false, message: 'Title and message are required' });

    const ann = await Announcement.create({
      teacher: teacherId,
      class: classId || undefined,
      title,
      message,
      date: date ? new Date(date) : undefined,
    });

    res.status(201).json({ success: true, announcement: { id: ann._id, title: ann.title, message: ann.message, date: ann.date } });
  } catch (err) {
    console.error('createAnnouncement error:', err);
    res.status(500).json({ success: false, message: 'Failed to create announcement' });
  }
}

// GET /api/teacher/announcements
async function getAnnouncements(req, res) {
  try {
    const teacherId = req.user._id;
    const anns = await Announcement.find({ teacher: teacherId }).sort({ createdAt: -1 }).lean();
    const out = anns.map((a) => ({ id: a._id, title: a.title, message: a.message, date: a.date }));
    res.json({ success: true, announcements: out });
  } catch (err) {
    console.error('getAnnouncements error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
  }
}

module.exports = {
  getClasses,
  createClass,
  getSubmissions,
  approveSubmission,
  rejectSubmission,
  createAnnouncement,
  getAnnouncements,
};
