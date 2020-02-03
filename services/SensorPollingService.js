const SensorService = require('../services/SensorService');
const INTERVAL = 3600000; // 1 hour // 60000; // 1 min

const run = () => {
    setInterval(SensorService.poll, INTERVAL);
}

module.exports = {
    run,
};