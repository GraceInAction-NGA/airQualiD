const SensorService = require('./SensorService');
const PurpleAirService = require('./PurpleAirService');
const AirNowService = require('./AirNowService');

const INTERVAL = 3600000; // 1 hour // 60000; // 1 min

const purpleAirPoller = async () => {
    const sensors = await SensorService.getAll();
    PurpleAirService.poll(sensors);
};

const airNowPoller = async () => {
    const zipcodes = 48210; // should be array of zipcodes based on user provided values
    AirNowService.poll(zipcodes);
}

const run = () => {
    setInterval(purpleAirPoller, INTERVAL);
    // setInterval(airNowPoller, INTERVAL);
};

module.exports = {
    run,
};