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

const purpleAirPoller = async (id) => {
    try {
        const response = await axios.get(`${PURPLEAIR_URL_BASE}${id}`);
        PurpleAirModel.create(response.data);
    } catch(e) {
        console.log(e)
    };
};

module.exports = {
    poll,
    create,
    search,
    searchBy
}