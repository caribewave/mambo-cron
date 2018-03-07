const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const FlightCron = require('./src/FlightCron');
const PlaneController = require('./src/PlaneController');

let app = express();

mongoose.connect('mongodb://localhost/mambo');

app.use(cors());

app.use('/planes', PlaneController);

app.get('/', (req, res) => {
      res.end('Bonjour à tous');g
    }
);

new FlightCron().launch();

app.listen(process.env.PORT || 8082);

