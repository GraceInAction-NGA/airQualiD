const AirNowModel = require("../models/AirNowModel");
const axios = require('axios');

const BASE_URL = "http://cloud.aeroqual.com";
const LOGIN_URL = `${BASE_URL}/api/account/login`;
const DATA_URL = `${BASE_URL}/api/data/serial`;

const OBSERVATION_URL = `${BASE_URL}/aq/observation/zipCode/current`;
let AUTH_TOKEN = null;
// TODO Do Not Commit This
const USERNAME = "sean@graceinactiondetroit.org";
const PASSWORD = "Grac3'NAct10N";

const login = async () => {
    return await axios.post(`${LOGIN_URL}`, {UserName: USERNAME, Password: PASSWORD});
}

const setAuthToken = async (data) => {
    AUTH_TOKEN = data.headers['set-cookie'][0];
}

const get = async (zipCode) => {
    return await axios.get(`${OBSERVATION_URL}?format=application/json&zipCode=${zipCode}&distance=25&API_KEY=${API_KEY}`);
}

const poll = async () => {
    try {
        const res = await login();
        setAuthToken(res);
        console.log(AUTH_TOKEN);
        // AirNowModel.create(data);
    } catch(err) {
        console.log('Failed to retrieve data', err);
        return null;
    }
}

module.exports = {
    poll
}