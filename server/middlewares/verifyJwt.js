const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');


module.exports = async (req, res, next) => {
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({ status: false, message: "Authorization token missing!" });
    }

    const auth = token.split(" ")[1];

    jwt.verify(auth, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err){
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ status: false, message: 'Token Expired' });
            }
            return res.status(403).json({ status: false, message: 'Invalid authorization token!' });
        }
        const adminData = await Admin.findById(decoded.userId);

        req.loggedInAdminId = adminData._id;
        next();
    })
}