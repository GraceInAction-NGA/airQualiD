const SensorService = require('../services/SensorService');
const INTERVAL = 3000; // 1 hour

const run = () => {
    setInterval(SensorService.poll, INTERVAL);
}

module.exports = {
    run,
};