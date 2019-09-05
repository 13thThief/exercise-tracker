'use strict';

let nanoid = require('nanoid');
let User = require('../models/User');

// Helper function
let findOne = (key, value) => {
    return User
        .findOne({
            [key]: value
        })
        .exec() // To promisify the query
}

let createUser = async username => {
    try {
        // Check if the username already exists
        let exists = await User.exists({
            username: username
        });
        if (exists)
            return Promise.reject('Username already taken!')
        let _id = nanoid(5);
        let doc = await User
            .create({
                username,
                _id
            })
            .catch(e => {
                console.error('Error API.createUser promise catch', e);
                throw new Error('Error API.createUser promise catch', e)
            })
        return doc;
    } catch (e) {
        console.error('Error API.createUser try catch', e);
    }
}

let addExercise = async (userId, description, duration, date) => {
    try {
        // Check if the username already exists
        // let exists = await findOne('_id', userId)
        let exists = await User.exists({
            _id: userId
        })
        if (!exists)
            return Promise.reject(`UserID doesn't exist!`)

        let result = await User
            .findByIdAndUpdate(
                userId, {
                    $push: {
                        exercise: {
                            description,
                            duration,
                            date
                        }
                    }
                }, {
                    new: true // Send altered document
                }
            )
            .exec() // To promisify
            .catch(e => {
                console.error('Error API.addExercise', e);
                return new Error('soethng broke')
            })
        return result;
    } catch (e) {
        console.error('Error API.addExercise catch block', e);
    }
}

let getLog = async (userId, from, to, limit) => {
    try {
        let exists = await User.exists({
            _id: userId
        });
        if (!exists)
            return Promise.reject(`UserID doesn't exist!`);

        let result = await User
            .findById(userId)
            .select('-exercise._id -__v')
            .exec()
            .catch(e => {
                console.error('Error API.getLog', e);
            })
        return result;
    } catch (e) {
        console.error('Error API.getLog', e);
    }
}

module.exports = {
    createUser,
    addExercise,
    getLog
}