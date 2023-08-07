const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();

// Models
const User = require('../models/user');
const UserPhoneNumbers = require("../models/userMobileNumbers");
const EmailVerification = require("../models/verifyEmailToken");


// Utils
const validateEmail = require('../utils/validateEmail');
const sendMailVerificationLink = require('../utils/emailVerificationLink');


exports.createUser = async (req, res, next) => {
    const {firstName, lastName, orgName, emailAddress, phoneNumber} = req.body;

    if (!firstName || !lastName || !emailAddress || !orgName || firstName.trim().length == 0 || lastName.trim().length == 0 || orgName.trim().length == 0 || emailAddress.trim().length==0 || phoneNumber.trim().length == 0 || !phoneNumber) {
        return res.status(406).json({status:false, message:"Incomplete data provided" });
    }

    let validEmail = await validateEmail(emailAddress.trim());
    if (!validEmail){
        return res.status(406).json({status:false, message:"Invalid email format" });
    }

    let isEmailRegistered = await User.findOne({email: emailAddress.trim().toLowerCase()});
    if (isEmailRegistered) {
        return res.status(200).json({status:false, message:"Email already registered" });
    }
    const passCode = Math.random().toString(36).substring(2, 12);
    const hashedPassword = await bcrypt.hash(passCode.trim().toString(), 12);
    const creationDate = new Date();

    await User.create({
        firstname: firstName.trim().toLowerCase(),
        lastname: lastName.trim().toLowerCase(),
        email: emailAddress.trim().toLowerCase(),
        organization: orgName.trim().toLowerCase(),
        password: hashedPassword,
        isEmailVerified: 'NO',
        dateCreated: creationDate
    });

    const createdUser = await User.findOne({email: emailAddress});

    // Register User Phone number
    await UserPhoneNumbers.create({user: createdUser._id, phoneNum:phoneNumber, dateCreated: creationDate});

    const secureToken = crypto.randomBytes(32).toString("hex");
    const tokenCreation = Date.now();
    const tokenExpiry = Date.now() + (3600 * 1000); // expires in 1 hour

    // Email verification token
    await EmailVerification.create({user: createdUser._id, token: secureToken, created: tokenCreation, expires: tokenExpiry});

    const verificationLink = `${process.env.BASE_URL}/api/v1/user/verify/${createdUser._id}/${secureToken}`;

    await sendMailVerificationLink(firstName, lastName, emailAddress, verificationLink);

    return res.status(200).json({status:true, message:"An email was sent to your mailing address for account verification." });
}

exports.updateUser = async (req, res, next) => {
    const {firstName, lastName, orgName, emailAddress, userId} = req.body;
    console.log(req.body.firstName)
    if (!firstName || !lastName || !emailAddress || !orgName || firstName.trim().length == 0 || lastName.trim().length == 0 || orgName.trim().length == 0 || emailAddress.trim().length==0 || !userId) {
        return res.status(406).json({status:false, message:"Incomplete user data provided" });
    }

    let validEmail = await validateEmail(emailAddress.trim());
    if (!validEmail){
        return res.status(406).json({status:false, message:"Invalid email format" });
    }

    let isUser = await User.findById(userId);
    if (!isUser) {
        return res.status(200).json({status:false, message:"User not found!" });
    }

    let isEmailRegistered = await User.findOne({email: emailAddress.trim().toLowerCase(), _id:{$nin: [userId]}});
    if (isEmailRegistered) {
        return res.status(200).json({status:false, message:"Email already registered" });
    }

    isUser.firstname = firstName.trim().toLowerCase();
    isUser.lastname = lastName.trim().toLowerCase();
    isUser.email = emailAddress.trim().toLowerCase();
    isUser.organization = orgName.trim().toLowerCase();

    await isUser.save();

    return res.status(200).json({status:true, message:"Account update successful" });
}


exports.verifyUserAccount = async (req, res, next) => {
    const userID = req.params.id;
    const userToken = req.params.token;

    const isValidLink = await EmailVerification.findOne({user: userID, token: userToken});
    if (!isValidLink) return res.status(403).json({status:false, message: "Invalid Link"});

    if (isValidLink.expires < Date.now()) {
        return res.status(403).json({status:false, message: "Verification Link Expired"});
    }

    // user account verified
    const updateUser = await User.findOneAndUpdate({_id:userID}, {isEmailVerified: "YES"}, {new: true});
    return res.status(200).json({status: true, message:"Account verified successfully. Proceed to login"});
}