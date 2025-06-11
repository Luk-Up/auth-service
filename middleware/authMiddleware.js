const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return res.status(401).json({ msg: "Not authorized, no token" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        req.user = await User.findById(decoded.id).select("-password");

        if(!req.user){
            res.status(401).json({ msg: "Not authorized, user not found" });
        }
        next();
    } catch(err){
        console.error("Token verification failed: ", err.message);
        res.status(401).json({ msg: "Not authorized, token failed" })
    }

};