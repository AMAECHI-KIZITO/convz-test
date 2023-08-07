const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    name: {
        type: String,
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

module.exports = mongoose.model("Report", reportSchema);