const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportConnectorSchema = new Schema({
    report: {
        type: Schema.Types.ObjectId,
        ref: "Report",
        required: true,
    },
    connector:{
        type: Schema.Types.ObjectId,
        ref: "Connector",
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("ReportConnector", reportConnectorSchema);