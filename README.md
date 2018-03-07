# Mambo Sensor API

Develop Branch: 
![Build status on develop](https://travis-ci.org/caribewave/mambo-sensor-api.svg?branch=develop)  
Master Branch:
![Build status on master](https://travis-ci.org/caribewave/mambo-sensor-api.svg?branch=master)

This project will behave as the dedicated TMS tile-server for the Mambo Project (Hackers Against Natural Disasters).

It uses a lightweight tile-server (tilestrata) and supports both file tiles (cache), mbtiles, and proxy layers.

To configure the tile-server, simply change the content of the conf/conf.js file.

To run the server, simply run ```npm start```.

The app is listening on port 8082 by default.


## Environment

### 1. Development environment
To spawn your development environment, use:
```
docker run --name mambo-mongo -d -p 27017:27017 mongo
npm start
```

## API

