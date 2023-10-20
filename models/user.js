const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userCreatedAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
});

module.exports = mongoose.model('User', userSchema);
