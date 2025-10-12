import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    name: String,
    size: Number,
    mime: String
});
const messageSchema = new mongoose.Schema({
    channelId: {
        type: Number,
        required: true,
        index: true
    },
    senderId: {
        type: Number,
        required: true
    },
    text: {
        type: String
    },
    attachments: [attachmentSchema],
    sequence: {
        type: Number,
        index: true
    },
    read_by: {
        type: [Number],
        default: []
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Message', messageSchema);