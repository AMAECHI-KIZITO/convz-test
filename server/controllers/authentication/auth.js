const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();

// Models
const User = require('../../models/user');
const Admin = require("../../models/admin");
const AdminRefToken = require("../../models/adminRefreshToken");

// Utils
const validateEmail = require('../../utils/validateEmail');
const sendLoginAttemptMail = require('../../utils/loginAttemptMail');


async function validateAdmin(email, password) {
    const isAdmin = await Admin.findOne({email: email});
    
    if (!isAdmin){
        return "User not found!";
    };

    let isValidCredentials = await bcrypt.compare(password, isAdmin.password);
    
    if(!isValidCredentials) {
        return "Invalid credentials";
    };

    const validatedData = {message: "Correct credentials", user: isAdmin};

    return validatedData;
}

const generateAccessToken = async (userData) => {
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 600 }); // 10 minutes
    return accessToken
}

const generateRefreshToken = async (userData) => {
    const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 3600 }); // 1hr
    return refreshToken
}

exports.registerAdmin = async (req, res, next) => {
    const {firstName, lastName, emailAddress, passCode, phoneNumber} = req.body;

    if (!firstName || !lastName || !emailAddress || !passCode || firstName.trim().length == 0 || lastName.trim().length == 0 || emailAddress.trim().length==0 || passCode.trim().length == 0 || phoneNumber.trim().length == 0 || !phoneNumber) {
        return res.status(406).json({status:false, message:"Incomplete data provided" });
    }

    let validEmail = await validateEmail(emailAddress.trim());
    if (!validEmail){
        return res.status(406).json({status:false, message:"Invalid email format" });
    }

    let isEmailRegistered = await Admin.findOne({email: emailAddress.trim().toLowerCase()});
    if (isEmailRegistered) {
        return res.status(406).json({status:false, message:"Email already registered" });
    }
    
    const hashedPassword = await bcrypt.hash(passCode.trim().toString(), 12);
    const creationDate = new Date();

    await Admin.create({
        firstname: firstName.trim().toLowerCase(),
        lastname: lastName.trim().toLowerCase(),
        email: emailAddress.trim().toLowerCase(),
        password: hashedPassword,
        phoneNumber:phoneNumber,
        dateCreated: creationDate
    });

    return res.status(200).json({status:true, message:"Administrative account created successfully" });
}

exports.loginAdmin = async (req, res, next) => {
    const {email, password} = req.body;
    

    if (!(email && password)) {
        return res.status(406).json({ status: false, message: "Incomplete credentials!" });
    }

    let isValidEmail = await validateEmail(email);
    if (!isValidEmail){
        return res.status(406).json({status:false, message:"Invalid email format" });
    }

    let isAdmin = await validateAdmin(email, password);

    if (typeof isAdmin === 'string') {
        return res.status(403).json({status:false, message: isAdmin });
    }
    const accessToken = await generateAccessToken({userId: isAdmin.user._id});
    const refreshToken = await generateRefreshToken({userId: isAdmin.user._id});

    const isAdminRefToken = await AdminRefToken.findOne({admin: isAdmin.user._id});
    if (!isAdminRefToken){
        await AdminRefToken.create({
            admin: isAdmin.user._id,
            refreshToken: refreshToken
        })
        // await sendLoginAttemptMail(isUser.user.firstname, isUser.user.lastname, isUser.user.email);
        return res.status(200).json({ status: true, message: "Login Successful", userAuth:{accessToken: accessToken, refreshToken: refreshToken, user: isAdmin.user._id} });
    }
    isAdminRefToken.refreshToken = refreshToken;
    isAdminRefToken.save();
    
    // await sendLoginAttemptMail(isUser.user.firstname, isUser.user.lastname, isUser.user.email);

    res.status(200).json({ status: true, message: "Login Successful", userAuth:{accessToken: accessToken, refreshToken: refreshToken, user: isAdmin.user._id} });
};

exports.refreshAllTokens = async (req, res, next) => {
    const {adminRefreshToken} = req.body;

    if (!adminRefreshToken) {
        return res.status(401).json({ status: false, message: "Missing Refresh Token!" });
    }

    jwt.verify(adminRefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err){
            return res.status(401).json({ status: false, message: 'Unauthorized refresh token!' });
        }

        const isAdminRefreshToken = await AdminRefToken.findOne({refreshToken: adminRefreshToken, admin: decoded.userId});
        if (!isAdminRefreshToken) {
            return res.status(401).json({ status: false, message: 'Incorrect admin refresh token' });
        }

        const accessToken = await generateAccessToken({userId: decoded.userId});
        const refreshToken = await generateRefreshToken({userId: decoded.userId});

        isAdminRefreshToken.refreshToken = refreshToken;
        isAdminRefreshToken.save();
        
        return res.status(200).json({ status: true, message: "Tokens reset successfully", userAuth:{accessToken: accessToken, refreshToken: refreshToken, user: decoded.userId} });
    })
};
