const express = require('express');
const cors = require('cors');
const FlightInfoService = require('./src/FlightInfoService');
const cron = require('node-cron');
const mongoose = require('mongoose');

let app = express();

mongoose.connect('mongodb://localhost/mambo');

app.use(cors());

let service = new FlightInfoService();

cron.schedule('*/15 * * * * *', function() {
  service.performRequest();
}, null, true, 'America/Los_Angeles');
