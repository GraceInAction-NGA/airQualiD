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
  setInterval(alertFunc, 10000);
  res.sendFile(__dirname + "/index.html");
});

function aqi(C){
  const Ih = 0
  const Il = 0
  const Ch = 0
  const Cl = 0
  const I = (Ih-Il/Ch-Cl)*(C-Cl)+ Il

  function getCategory (I){
    if (I <=50)
      return ("Good")
    if (I <=100)
      return ("Moderate")
    if (I <=150)
      return ("Unhealthy for Sensative Groups")
    if (I <=200)
      return ("Unhealthy")
    if (I <=300)
      return ("Very Unhealthy")
    if (I <=500)
      return ("Hazardous")   
    return("You're dead")
  }

var category = getCategory(I)
return [I,getCategory]
}

function alertFunc() {
  axios.get("https://www.purpleair.com/json?show=37399")
  .then(data => {
    console.log(data.data.results[0].Stats);
    var obj = JSON.parse (data.data.results[0].Stats)
    var obj_2 = JSON.parse (data.data.results[1].Stats)
    console.log (obj)
    data.data.results[0].Stats = obj
    data.data.results[1].Stats = obj_2
    database.collection("readings").add(data.data);
  });
}

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))