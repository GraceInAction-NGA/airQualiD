const firebase = require('firebase/app')
require("firebase/auth")
require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyA2JXvMwYYIjL4290zqmt5bn4eEJTeIAWU",
  authDomain: "airqualid.firebaseapp.com",
  databaseURL: "https://airqualid.firebaseio.com",
  projectId: "airqualid",
  storageBucket: "airqualid.appspot.com",
  messagingSenderId: "856517395991",
  appId: "1:856517395991:web:d3c7b92d3c88e955d5be52"
};

firebase.initializeApp(firebaseConfig)
const database = firebase.firestore()

const create = (collection, data) => {
  database.collection(collection).add(data);
}

module.exports = {
  database,
  create
}