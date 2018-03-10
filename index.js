const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const FlightCron = require('./src/cron/FlightCron');
const PlaneController = require('./src/plane/plane.controller');

let app = express();

mongoose.connect('mongodb://localhost/mambo');

app.use(cors());

app.use('/planes', PlaneController);

app.get('/', (req, res) => {
      res.end('Bonjour à tous');
    }
);

// new FlightCron().launch();

app.listen(process.env.PORT || 8082);