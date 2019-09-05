'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');

let mongoose = require('mongoose');

const config = require('./config');
const routes = require('./routes/routes');

const mongooseOptions = {
    useNewUrlParser: true,
    family: 4,
    reconnectTries: 2,
    reconnectInterval: 10000,
    autoReconnect: true
}

app.use(cors({
    optionSuccessStatus: 200
}));
app.use(helmet());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static(`${__dirname}/public`));
app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
    res.render('index');
})

app.use('/api/exercise/', routes);

// 404 Handler
app.use('*', (req, res, next) => {
    res.sendStatus(404);
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log("Database disconnected due to application termination");
        process.exit(0);
    });
});

mongoose
    .connect(config.MONGO_URI, mongooseOptions)
    .then(() => {
        console.log('Database running');
        // Start listening only after the database connection
        const listener = app.listen(process.env.PORT || 3000, () => {
            console.log('Server running on', listener.address().port);
        });
    })
    .catch(e => {
        console.error('Database connection failed');
    })
