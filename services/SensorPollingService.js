const PurpleAirModel= require('../models/PurpleAirModel');
const axios = require('axios');

const INTERVAL = 30000;
const PURPLEAIR_URL = "https://www.purpleair.com/json?show=37399";

const purpleAirPoller = async () => {
    try {
        const response = await axios.get(PURPLEAIR_URL);
        PurpleAirModel.create(response.data);
        console.log("Polling PurpleAir")
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