const firebase = require('firebase/app')
require("firebase/auth")
require("firebase/firestore")
const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000


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

app.get('/', (req, res) => { 
  setInterval(alertFunc, 600000);
  res.sendFile(__dirname + "/index.html");
});

function alertFunc() {
  axios.get("https://www.purpleair.com/json?show=37399")
  .then(data => {
    console.log(data.data);
    database.collection("readings").add(data.data);
  });
}

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))