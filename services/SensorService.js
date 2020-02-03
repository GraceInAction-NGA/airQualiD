const PurpleAirModel= require('../models/PurpleAirModel');
const SensorModel = require("../models/SensorModel");
const axios = require('axios');
const PURPLEAIR_URL_BASE = "https://www.purpleair.com/json?show=";

const poll = async () => {
    const sensors = await SensorModel.getAll();
    console.log(sensors);
    purpleAirPoller(sensors);
};

const create = async (sensor) => {
    try {
        const ref = await SensorModel.create(sensor);
        console.log('Created document with ID: ', ref.id);
        return ref;
      } catch(err) {
        console.log('Failed to create document: ', err);
        return null;
      }
};

const search = async (sensor) => {
    try {
        const snapshot = await SensorModel.search(sensor);
        const datas = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            data['id'] = doc.id;
            datas.push(data);
        });
        return datas;
      } catch(err) {
        console.log('Failed to search for sensor: ', err);
        return null;
      }
};

const searchBy = async (value, key) => {
    try {
        const snapshot = await SensorModel.searchBy(value || '', key); 
        const datas = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            data['id'] = doc.id;
            datas.push(data);
        });
        return datas;
    } catch(e) {
        console.log(e)
        return null;
    };
};

// Deprecated
const purpleAirPollerDeprecated = async (id) => {
    try {
        const response = await axios.get(`${PURPLEAIR_URL_BASE}${id}`);
        PurpleAirModel.create(response.data);
    } catch(e) {
        console.log(e)
    };
};

const purpleAirPoller = async (sensors) => {
    const sensorIds = sensors.map(sensor => sensor.sensorID);
    const query = sensorIds.reduce((acc, id, i) => {
        return (i === 0) ? id : `${acc}|${id}`;
    }, "");
    try {
        const {data} = await axios.get(`${PURPLEAIR_URL_BASE}${query}`);
        const validData = data.results.filter(sensor => {
            return sensorIds.includes(String(sensor.ID));
        });

        PurpleAirModel.create(validData);
    } catch(e) {
        console.log(e)
    };
};

const getLatest = async () => {
    try {
        const querySnapshot = await SensorModel.getLatest();
        const data = [];
        querySnapshot.forEach(doc => data.push(doc.data()));
        return data;
    } catch(err) {
        console.log('Failed to latest retrieve data', err);
        return null;
    }
}

module.exports = {
    poll,
    create,
    getLatest,
    search,
    searchBy
}