// backend/middlewares/admin.middleware.js
exports.restrictToAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "You are not logged in",
    });
  }

  if (!req.user.isAdmin && req.user.role !== 'admin') {
    return res.status(403).json({
      status: "error",
      message: "You do not have permission to perform this action. Admin access required.",
    });
  }

  next();
};