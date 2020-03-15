const firebase = require('../services/FirebaseService');
const AqiAdapter = require('../helpers/AqiAdapter');

//TODO save airnow data to firebase
const create = async (data) => {
    //firebase.database.collection("aeroqual").add(data);
    const aqi = AqiAdapter.fromAeroQual(data);
    //firebase.database.collection("aqis").add(aqi);
};

module.exports = {
    create,
}