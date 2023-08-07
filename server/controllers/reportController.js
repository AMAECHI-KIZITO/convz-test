// Models
const Report = require('../models/report');
const ReportController = require('../models/reportConnector');
const User = require("../models/user");


exports.createReport = async (req, res, next) => {
    const {reportName, reportUser} = req.body;

    if(!reportName || reportUser == '#' || reportName.trim().length === 0){
        return res.status(406).json({status: false, message:'Incomplete form data!'})
    }

    const isUser = await User.findById(reportUser);
    if (!isUser) {
        return res.status(406).json({status: false, message:'No record found for this user you wish to create the report for!'})
    }


    await Report.create({
        name: reportName.trim().toLowerCase(),
        mappedTo: reportUser,
        dateCreated: new Date()
    })
    return res.status(200).json({status: true, message:'Report created successfully'})
}

exports.getUserReports = async (req, res, next) => {
    const {userId} = req.params;
    const isUser = await User.findById(userId);
    if (!isUser) {
        return res.status(404).json({status: false, message:'User not found!'})
    }
    let userName = isUser.firstname [0].toUpperCase() + isUser.firstname.substring(1).toLowerCase();
    let userReports = await Report.find({mappedTo: isUser});
    if (userReports.length == 0) {
        return res.status(200).json({status: true, message:'Users reports fetched successfully', reports: [], userName: userName})
    }

    let serialNum = 0;
    const data = [];
    for (rep of userReports) {
        const repInfo = {
            repId: rep._id,
            serialNo: serialNum + 1,
            name: rep.name[0].toUpperCase() + rep.name.substring(1),
            dateCreated: rep.dateCreated.toLocaleString()
        }
        data.push(repInfo);
    }
    return res.status(200).json({status: true, message:'Users connectors fetched successfully', reports: data, userName: userName});
}

exports.deleteReport = async (req, res, next) => {
    const {reportId} = req.body;
    const isReport = await Report.findById(connId);
    if (!isReport) {
        return res.status(404).json({status: false, message:'Invalid report id'})
    }

    await Connector.deleteOne({_id: connId})
    return res.status(200).json({status: true, message:'Report deleted successfully'});
}