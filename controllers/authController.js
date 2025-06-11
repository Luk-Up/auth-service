const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){ // <--- CORRECTED
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try{
        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ msg: "User already exists with the same email" });
        }
        user = await User.findOne({ username });
        if(user){
            return res.status(400).json({ msg: "User already exists with the same Username"});
        }
        user = new User({ username, email, password });
        await user.save();
        sendTokenResponse(user, 201, res);
    } catch(err){
        console.error(err);
        res.status(500).send("Server error");
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email }).select("+password");
        if(!user){
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        
        const isMatch = await User.matchPasword(password);

        if(!isMatch){
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        sendTokenResponse(user, 200, res);
    } catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getMe = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({ msg: "User not found"});
        }
        res.json(user); 
    } catch(err){
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    // const options = {
    //     expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || '30') * 24 * 60 * 60 * 1000),
    //     httpOnly: true
    // };

    res.status(statusCode).json({ success: true, token})
};