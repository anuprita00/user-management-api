// This middleware restricts routes based on user roles
module.exports = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(403).json({ message: "Unauthorized: No role found" });
    }
    else if(req.user.role !== "admin"){
        return res.status(403).json({message: "Forbidden: You don't have permission"})
    }
    next();
};
