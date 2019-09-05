'use strict';

let express = require('express');
let router = express.Router();

let controller = require('../controllers');

/* ROUTE /api/exercise/ */

// Create a New User
// POST /api/exercise/new-user
router.post('/new-user', controller.createUser);

// Add exercises
// POST /api/exercise/add
router.post('/add', controller.addExercise);

// Get an user's exercise log
// GET /api/exercise/log?{userId}[&from][&to][&limit]
router.get('/log', controller.getLog)

module.exports = router;
