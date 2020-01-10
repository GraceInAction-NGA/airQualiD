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

const create = () => {

};

module.exports = {
    create,
    get,
    getAll
}