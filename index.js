const express = require('express');
const cors = require('cors');

const FlightCron = require('./lib/cron/flightCron');
const PlaneController = require('./lib/plane/planeController');
const DB = require('./lib/db/index');

const initSensorApi = async () => {
  let app = express();
  app.use(cors());

  app.get('/planes/all', PlaneController.onGetAll);
  app.get('/planes/loc', PlaneController.onGetLoc);

  app.get('/', (req, res) => {
        res.end('Bonjour à tous');
      }
  );
  app.listen(process.env.PORT || 8082);
};


const init = async () => {
  await DB.connect();
  await initSensorApi();
  await FlightCron.init();
};

(async function () {
  await init();
})();

