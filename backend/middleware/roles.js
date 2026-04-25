module.exports.requireRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
      }
      next();
    } catch (err) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
  };
};
