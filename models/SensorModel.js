const firebase = require('../services/FirebaseService');

const get = () => {

};

// TODO Consider refactoring to limit the number of reads we make to FireStore
// Maybe a caching solution would be advisable or a listener/subscription FireStore model.
const getAll = async () => {
    const snapshot = await firebase.database.collection('sensors').get();
    const datas = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      data['id'] = doc.id;
      datas.push(data);
    });
    return datas;
};

const create = async (sensor) => {
  return await firebase.database.collection('sensors').add(sensor);
};

const search = async (sensor) => {
  return await firebase.database.collection('sensors')
    .where("sensorID", "==", sensor.sensorID)
    .where("sensorName", "==", sensor.sensorName)
    .where("sensorType", "==", sensor.sensorType)
    .get();
};

const searchBy = async (value, key) => {
  return await firebase.database.collection('sensors')
    .where(key, "==", value).get();
};

const getLatest = async () => {
  return await firebase.database.collection('aqis')
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();
}

module.exports = {
    create,
    get,
    getAll,
    getLatest,
    search,
    searchBy
}