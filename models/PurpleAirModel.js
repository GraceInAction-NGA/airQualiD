const firebase = require('../services/FirebaseService');
const AqiAdapter = require('../helpers/AqiAdapter');

const parse = (data) => {
    data.results[0].Stats = JSON.parse(data.results[0].Stats);
    data.results[1].Stats = JSON.parse(data.results[1].Stats);
    return data;
}

const create = async (data) => {
    const parsedData = parse(data);
    firebase.database.collection("readings").add(parsedData);

    const aqi = AqiAdapter.fromPurpleAirAqi(parsedData);
    firebase.database.collection("aqis").add(aqi);
}

module.exports = {
    create
}