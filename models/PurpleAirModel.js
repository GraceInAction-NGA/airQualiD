const firebase = require('../services/FirebaseService');
const AqiAdapter = require('../helpers/AqiAdapter');

const ONE_WEEK_MILLIS = 604800000;

// Deprecated
const parseDeprecated = (data) => {
    data.results[0].Stats = JSON.parse(data.results[0].Stats);
    data.results[1].Stats = JSON.parse(data.results[1].Stats);
    return data;
}

const parse = (data) => {
    data.Stats = JSON.parse(data.Stats);
    return data;
}

// Deprecated
const createDeprecated = async (data) => {
    const parsedData = parse(data);
    firebase.database.collection("readings").add(parsedData);

    const aqi = AqiAdapter.fromPurpleAirAqi(parsedData);
    firebase.database.collection("aqis").add(aqi);
}

const create = async (datas) => {
    datas.forEach(data => {
        const parsedData = parse(data);
        if (Date.now() - data.Stats.lastModified < ONE_WEEK_MILLIS) {
            firebase.database.collection("readings").add(parsedData);

            const aqi = AqiAdapter.fromPurpleAirAqi(parsedData);
            firebase.database.collection("aqis").add(aqi);
            console.log(aqi);
        }
    });
}

module.exports = {
    create
}