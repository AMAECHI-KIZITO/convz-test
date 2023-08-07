const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const connectorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    service: {
        type: String,
        enum: ['adjust', "asana", 'magneto'],
        required: true
    },
    sync: {
        type: String,
        enum: ['ON', "OFF"],
        required: true
    },
    status: {
        type: String,
        enum: ['Connected', "In Progress"],
        required: true
    },
    mappedTo:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Connector", connectorSchema);