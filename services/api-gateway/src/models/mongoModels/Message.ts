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

const reactionsSchema = new mongoose.Schema({
    react: {
        type: String,
        required: true
    },
    reactorId: {
        type: Number,
        required: true
    }
})
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
    reactions: [reactionsSchema],
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

export default mongoose.model('Message', messageSchema);