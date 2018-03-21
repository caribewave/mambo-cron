const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const DB = require('./lib/db/index');

const Logger = require('./lib/log/Logger')();
const Spinner = Logger.spinner();
const FlightCron = require('./lib/cron/flightCron');
const PlaneController = require('./lib/plane/planeController');
const SensorController = require('./lib/sensor/sensorController');
const BoatController = require('./lib/boat/boatController');


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


  const planeBase = '/planes';
  app.get(planeBase + '/all', PlaneController.onGetAll);
  app.get(planeBase + '/loc', PlaneController.onGetLoc);
  app.get(planeBase + '/:hex', PlaneController.onGet);

  const sensorBase = '/sensors';

  const base = '/pois';
  app.get(base + '/:source/:id', SensorController.onGet);
  app.get(base, SensorController.onGetLoc);

  app.delete(base + '/:source/:label', SensorController.onDelete);

  app.get(sensorBase + '/all', SensorController.onGetAll);
  app.get(sensorBase + '/loc', SensorController.onGetLoc);
  app.get(sensorBase + '/:label', SensorController.onGet);
  app.post(sensorBase, SensorController.onPost);
  app.delete(sensorBase + '/:label', SensorController.onDelete);
  app.put(sensorBase + '/:label/activate/:activate', SensorController.onActivate);
  app.put(sensorBase + '/:label', SensorController.onEdit);


  const boatBase = '/boats';
  app.get(boatBase + '/all', BoatController.onGetAll);
  app.get(boatBase + '/:hex', BoatController.onGet);
  app.post(boatBase, BoatController.onPost);
  app.put(boatBase + '/:hex', BoatController.onPut);
  app.delete(boatBase + '/:hex', BoatController.onDelete);

  app.get('/', (req, res) => {
        res.end('Bonjour à tous');
      }
  );
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
  Spinner.start('Initializing Plane Controller');
  await PlaneController.init();
  Spinner.succeed();
  Logger.info('App successfully initialized');
};

(async () => {
  await init();
})();

