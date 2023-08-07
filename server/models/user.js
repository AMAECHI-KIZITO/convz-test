const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: String,
        enum: ['YES', "NO"],
        default: "NO",
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);