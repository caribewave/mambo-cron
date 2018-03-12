const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const DB = require('./lib/db/index');

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

  app.get('/', (req, res) => {
        res.end('Bonjour à tous');
      }
  );
  app.listen(process.env.PORT || 8082);
};


const init = async () => {
  await DB.connect();
  await initSensorApi();
  // await FlightCron.init();
};

(async () => {
  await init();
})();

