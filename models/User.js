'use strict';

let mongoose = require('mongoose');
// Don't use models before the database connection
mongoose.set('bufferCommands', false);

const userSchema = new mongoose.Schema({
    _id: String,
    username: String,
    exercise: [{
        description: String,
        duration: Number,
        date: {
            type: Date,
            default: new Date()
        }
    }]
})

const User = mongoose.model('User', userSchema);

module.exports = User;