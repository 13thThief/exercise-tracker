'use strict';

let API = require('../api/api');

// Create a New User
// POST /api/exercise/new-user
// username
let createUser = async (req, res, next) => {
    // Username is required
    if (!req.body.username)
        return res
            .status(400)
            .send('<code>username</code> is required!')
    if (req.body.username.length > 13)
        return res
            .status(400)
            .send('<code>username</code> too long!')
    // Create
    API
        .createUser(req.body.username)
        .then(doc => {
            return res.json({
                username: doc.username,
                _id: doc._id
            })
        })
        .catch(reason => {
            return res
                .status(400)
                .send(reason)
        })
}

// Add exercises
// POST /api/exercise/add
// userId*, description*, duration*, date(or default)
let addExercise = (req, res, next) => {
    // UserId, Description and Duration are required
    if (
        !req.body.userId ||
        !req.body.description ||
        !req.body.duration
    )
        return res
            .status(400)
            .send('<code>userId, description, duration</code> are required!');

    if (isNaN(Number(req.body.duration)))
        return res
            .status(400)
            .send('<code>duration</code> should be a Number!');

    let userId = req.body.userId;
    let description = req.body.description;
    let duration = req.body.duration;
    let date = req.body.date;
    if (date)
        date = new Date(date).toISOString()
    else date = new Date().toISOString()
    API
        .addExercise(
            userId,
            description,
            duration,
            date
        )
        .then(doc => {
            return res.json({
                username: doc.username,
                description,
                duration,
                date: new Date(date).toUTCString()
            })
        })
        .catch(reason => {
            return res
                .status(400)
                .send(reason)
        })
}

// Get an user's exercise log
// GET /api/exercise/log?{userId}[&from][&to][&limit]
// userId*, from, to, limit
let getLog = (req, res, next) => {
    if (!req.query.userId)
        return res.send('Unknown userId')

    let userId = req.query.userId;
    let from = req.query.from ? new Date(req.query.from) : null;
    let to = req.query.to ? new Date(req.query.to) : null;
    let limit = req.query.limit ? Number(req.query.limit) : null;

    API
        .getLog(userId, from, to, limit)
        .then(doc => {
            if (doc.exercise.length === 0)
                return res.status(400).send('No logs yet')
            let log = doc.exercise
            if (from)
                log = log.filter(item => item.date >= from)
            if (to)
                log = log.filter(item => item.date <= to)
            if (limit)
                log = log.slice(0, limit)

            return res.json({
                _id: userId,
                username: doc.username,
                count: log.length,
                log
            })
        })
        .catch(reason => {
            return res
                .status(400)
                .send(reason)
        })
}

module.exports = {
    createUser,
    addExercise,
    getLog
}