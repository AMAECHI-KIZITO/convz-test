const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailVerificationTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token:{
        type:String,
        required: true
    },
    created:{
        type: Number,
        required: true
    },
    expires: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("User_Email_Verification_Token", emailVerificationTokenSchema);