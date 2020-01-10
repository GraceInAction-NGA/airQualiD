const PurpleAirModel= require('../models/PurpleAirModel');
const SensorModel = require("../models/SensorModel");
const axios = require('axios');
const PURPLEAIR_URL_BASE = "https://www.purpleair.com/json?show=";

// Will the endpoint reject if we poll for different sensors with less than a minute between calls
const poll = async () => {
    const sensors = await SensorModel.getAll();
    sensors.forEach(sensor => {
        if (sensor.sensorType == "Purple Air") {
            purpleAirPoller(sensor.sensorID);
        } else {
            console.log("Sensor has an invalid type", sensor);
        }
    });
}

const purpleAirPoller = async (id) => {
    try {
        const response = await axios.get(`${PURPLEAIR_URL_BASE}${id}`);
        PurpleAirModel.create(response.data);
    } catch(e) {
        console.log(e)
    }
}

module.exports = {
    poll
}