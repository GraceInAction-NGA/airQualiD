const PurpleAirRepository = require('./PurpleAirRepository');
const axios = require('axios');

const PURPLEAIR_URL = "https://www.purpleair.com/json?show=37399";

function getPurpleAir() {
    axios.get(PURPLEAIR_URL)
    .then(PurpleAirRepository.save)
    .catch(err => console.log(err));
}

module.exports = {
    getPurpleAir
};