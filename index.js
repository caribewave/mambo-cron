const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const DB = require('./lib/db/index');

const Logger = require('./lib/log/Logger')();
const Spinner = Logger.spinner();
const FlightCron = require('./lib/cron/flightCron');
const SensorController = require('./lib/sensor/sensorController');

const PoiController = require('./lib/poi/poiController');


const setGlobalHeaders = async (req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
};

const initSensorApi = async () => {
  let app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.get('/*', setGlobalHeaders);

  const sensorBase = '/sensors';
  const base = '/pois';

  app.get(base + '/:source/:id', PoiController.onGet);
  app.get(base, PoiController.onGetLoc);

  app.delete(base + '/:source/:label', PoiController.onDelete);

  app.post(base + '/:source', PoiController.onPost);

  app.put(base + '/:source/:id', PoiController.onEdit);

  app.put(sensorBase + '/:label/activate/:activate', SensorController.onActivate);

  app.listen(process.env.PORT || 8082);
};

const init = async () => {
  Logger.info('Initializing app');
  Spinner.start('Connecting to Database');
  await DB.connect();
  Spinner.succeed();
  Spinner.start('Initializing Sensor API');
  await initSensorApi();
  Spinner.succeed();
  Spinner.start('Initializing Flight Cron');
  await FlightCron.init();
  Spinner.succeed();
  Spinner.start('Initializing Poi Controller');
  await PoiController.init();
  Spinner.succeed();
  Logger.info('App successfully initialized');
};

(async () => {
  await init();
})();

