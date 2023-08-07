const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminTokenSchema = new Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
    refreshToken: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Admin_Refresh_Token", AdminTokenSchema);