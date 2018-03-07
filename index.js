const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const mongoose = require('mongoose');

const FlightCron = require('./src/FlightCron');


let app = express();

mongoose.connect('mongodb://localhost/mambo');

app.use(cors());

new FlightCron().launch();

cron.schedule('* * * * * *', () => {
});

