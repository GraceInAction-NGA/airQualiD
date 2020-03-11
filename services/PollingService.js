import SensorService from './SensorService';
import PurpleAirService from './PurpleAirService';

const INTERVAL = 3600000; // 1 hour // 60000; // 1 min

const purpleAirPoller = async () => {
    const sensors = await SensorService.getAll();
    console.log(sensors);
    PurpleAirService.poll(sensors);
};

const run = () => {
    setInterval(purpleAirPoller, INTERVAL);
};

module.exports = {
    run,
};