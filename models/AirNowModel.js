const firebase = require('../services/FirebaseService');
const AqiAdapter = require('../helpers/AqiAdapter');

const create = async (data) => {
    firebase.database.collection("airnow").add(data);

    const aqi = AqiAdapter.fromAirNow(data);
    //firebase.database.collection("aqis").add(aqi);
};

module.exports = {
    create,
}