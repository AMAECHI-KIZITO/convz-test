// Models
const User = require('../models/user');
const UserMobileNumber = require("../models/userMobileNumbers");


exports.getAllUsers = async (req, res, next) => {
    const allUsers = await User.find();
    if (allUsers.length === 0){
        return res.status(200).json({status: true, message:'Users fetched successfully', users:[]})
    }
    const users = [];
    let serialNum = 0;

    for (let user of allUsers) {
        const userData = {};
        userData.serialNo = serialNum + 1;
        userData.userId = user._id;
        userData.firstname = user.firstname[0].toUpperCase() + user.firstname.substring(1).toLowerCase();
        userData.lastname = user.lastname[0].toUpperCase() + user.lastname.substring(1).toLowerCase();
        userData.email = user.email;
        userData.organization = user.organization.toUpperCase();
        userData.verificationStatus = user.isEmailVerified;

        const userPhone = [];
        const phoneNumbers = await UserMobileNumber.find({user: user._id});

        if (phoneNumbers.length === 0){
            userData.userPhoneNumbers = userPhone;
        }else{
            for (let contact of phoneNumbers) {
                userPhone.push(contact.phoneNum);
            }
            userData.userPhoneNumbers = userPhone;
        }

        users.push(userData)
    }
    return res.status(200).json({status: true, message:'Users fetched successfully', users:users})
}

exports.getUserDetail = async (req, res, next) => {
    const {userId} = req.params;

    const isUser = await User.findById(userId);
    if (!isUser) {
        return res.status(404).json({status: false, message:'User not found!'})
    }
    const userData = {
        firstname: isUser.firstname,
        lastname: isUser.lastname,
        email: isUser.email,
        organization: isUser.organization,
        dateCreated: isUser.dateCreated.toLocaleString()
    }
    if (isUser.isEmailVerified === 'YES'){
        userData.verificationStatus = "Verified"
    }else{
        userData.verificationStatus = "Unverified"
    }
    return res.status(200).json({status: true, message:'User detail fetched successfully', userDetail:userData})
}

exports.getDashboardStatistics = async (req, res, next) => {
    const allUsers = await User.find();
    const verifiedUsers = await User.find({isEmailVerified: "YES"});
    
    let dashboardStatistics = {
        totalUsers: allUsers.length,
        totalVerifiedUsers: verifiedUsers.length,
        totalUnverifiedUsers: allUsers.length - verifiedUsers.length
    }
    return res.status(200).json({status: true, message:'Dashboard statistics retrieved', dashboardStats:dashboardStatistics})
}