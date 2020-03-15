const AirNowModel = require("../models/AirNowModel");
const axios = require('axios');

const BASE_URL = "http://www.airnowapi.org";
const OBSERVATION_URL = `${BASE_URL}/aq/observation/zipCode/current`;
const API_KEY = "29457CC3-CA0A-4369-B42D-3BA5B171D8FE";

const get = async (zipCode) => {
    return await axios.get(`${OBSERVATION_URL}?format=application/json&zipCode=${zipCode}&distance=25&API_KEY=${API_KEY}`);
}

const poll = async (zipCode) => {
    try {
        const {data} = await get(zipCode);
        console.log(data);
        AirNowModel.create(data);
    } catch(err) {
        console.log('Failed to retrieve data', err);
        return null;
    }
}

module.exports = {
    poll
}