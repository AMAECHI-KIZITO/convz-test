const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userPhoneNumberSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    phoneNum:{
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("User_Phonenumber", userPhoneNumberSchema);