const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const DB = require('./lib/db/index');

const Logger = require('./lib/log/Logger')();
const Spinner = Logger.spinner();
const FlightCron = require('./lib/cron/flightCron');
const PlaneController = require('./lib/plane/planeController');
const SensorController = require('./lib/sensor/sensorController');

const initSensorApi = async () => {
  let app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.get('/planes/all', PlaneController.onGetAll);
  app.get('/planes/loc', PlaneController.onGetLoc);
  app.get('/planes/:hex', PlaneController.onGet);

  app.get('/sensor/all', SensorController.onGetAll);
  app.post('/sensor', SensorController.onPost);
  app.get('/sensor/:label', SensorController.onGet);
  app.delete('/sensor/:label', SensorController.onDelete);
  app.put('/sensor/:label/activate/:activate', SensorController.onActivate);

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

