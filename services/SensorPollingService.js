const PurpleAirModel= require('../models/PurpleAirModel');
const axios = require('axios');

const INTERVAL = 3600000; // 1 hour
const PURPLEAIR_URL = "https://www.purpleair.com/json?show=37399";

const purpleAirPoller = async () => {
    try {
        const response = await axios.get(PURPLEAIR_URL);
        PurpleAirModel.create(response.data);
    } catch(e) {
        console.log(e)
    }
}

const run = () => {
    setInterval(purpleAirPoller, INTERVAL);
}

module.exports = {
    run,
};