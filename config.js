'use strict';

require('dotenv').config();

const config = {
  MONGO_URI: process.env.NODE_ENV === 'development' ?
              'mongodb://localhost:27017/exercise-tracker' : process.env.MONGO_URI
}

module.exports = config;