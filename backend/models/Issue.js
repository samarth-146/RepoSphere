const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        required: true
    },
    // user:
    // {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    // }
});

const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;