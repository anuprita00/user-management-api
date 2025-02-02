const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    // Extract token from Authorization header
    if(!token) return res.status(401).json({message:"Access denied"});

    try{
        // Verify token using the secret and remove 'Bearer ' prefix
        const verified = jwt.verify(token.replace("Bearer ",""),process.env.JWT_SECRET);
         // Attach the verified user data to the request object
        req.user = verified;
        next(); // Move to the next middleware or route handler
    }catch (err) {
        // Handle invalid or expired token
        res.status(400).json({message:"Invalid token"});
    }
};