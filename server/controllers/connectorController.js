// Models
const Connector = require('../models/connector');
const User = require("../models/user");


exports.createConnector = async (req, res, next) => {
    const {connectorName, connectorService, connectorUser, sync, connectorStatus} = req.body;
    if(!connectorName || connectorService == '#' || connectorUser == '#'|| sync=='#' || connectorStatus == '#' || connectorName.trim().length === 0){
        return res.status(406).json({status: false, message:'Incomplete form data!'})
    }

    const isUser = await User.findById(connectorUser);
    if (!isUser) {
        return res.status(406).json({status: false, message:'Connector user not found!'})
    }

    const isNameUnique = await Connector.findOne({name: connectorName.trim().toLowerCase()});
    if (isNameUnique){
        return res.status(406).json({status: false, message:'Connector name already registered'})
    }

    await Connector.create({
        name: connectorName.trim().toLowerCase(),
        service: connectorService.trim().toLowerCase(),
        sync: sync.toUpperCase(),
        status: connectorStatus.trim(),
        mappedTo: connectorUser,
        dateCreated: new Date()
    })
    return res.status(200).json({status: true, message:'Connector created successfully'})
}

exports.getUserConnectors = async (req, res, next) => {
    const {userId} = req.params;
    const isUser = await User.findById(userId);
    if (!isUser) {
        return res.status(404).json({status: false, message:'User not found!'})
    }
    let userName = isUser.firstname [0].toUpperCase() + isUser.firstname.substring(1).toLowerCase();
    let userConnectors = await Connector.find({mappedTo: isUser});
    if (userConnectors.length == 0) {
        return res.status(200).json({status: true, message:'Users connectors fetched successfully', connectors: [], userName: userName})
    }

    let serialNum = 0;
    const data = [];
    for (conn of userConnectors) {
        const connInfo = {
            connId: conn._id,
            serialNo: serialNum + 1,
            name: conn.name[0].toUpperCase() + conn.name.substring(1),
            service: conn.service[0].toUpperCase() + conn.service.substring(1),
            sync: conn.sync[0].toUpperCase() + conn.sync.substring(1),
            status: conn.status[0].toUpperCase() + conn.status.substring(1),
            dateCreated: conn.dateCreated.toLocaleString()
        }
        data.push(connInfo)
    }
    return res.status(200).json({status: true, message:'Users connectors fetched successfully', connectors: data, userName: userName});
}

exports.deleteConnector = async (req, res, next) => {
    const {connId} = req.body;
    const isConnector = await Connector.findById(connId);
    if (!isConnector) {
        return res.status(404).json({status: false, message:'Invalid connector id'})
    }

    await Connector.deleteOne({_id: connId})
    return res.status(200).json({status: true, message:'Connector deleted successfully'});
}