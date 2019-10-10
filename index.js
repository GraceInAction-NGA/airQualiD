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
  setInterval(alertFunc, 30000);
  res.sendFile(__dirname + "/index.html");
});

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
  return ("Hazardous")   
}

function getCl (C){
  if (C <=12.0)
    return (0.0)
  if (C <=35.4)
    return (12.1)
  if (C <=55.4)
    return (35.5)
  if (C <=150.4)
    return (55.5)
  if (C <=250.4)
    return (150.5)
  if (C <=350.4)
    return (250.5)
  if (C <=500.4)
    return (350.5)
  return (500.5)
}

function getCh (C){
  if (C <=12.0)
    return (12.0)
  if (C <=35.4)
    return (35.4)
  if (C <=55.4)
    return (55.4)
  if (C <=150.4)
    return (150.4)
  if (C <=250.4)
    return (250.4)
  if (C <= 350.4)
    return (350.4)
  if (C <= 500.4)
    return (500.4)
  return (99999.9)
}

function getIl (C){
  if (C <=50)
    return (0)
  if (C <=100)
    return (51)
  if (C <=150)
    return (101)
  if (C <=200)
    return (151)
  if (C <=300)
    return (201)
  if (C <=400)
    return (301)
  if (C <=500)
    return (401)
  return (501)
}

function getIh (C){
  if (C <=50)
    return (50)
  if (C <=100)
    return (100)
  if (C <=150)
    return (150)
  if (C <=200)
    return (200)
  if (C <=300)
    return (300)
  if (C <=400)
    return (400)
  if (C <=500)
    return (500)
  return (999)
}

function getAqi(C){
  var Ih = getIh(C)

  var Il = getIl(C)

  var Ch = getCh(C)

  var Cl = getCl(C)

  const I = ((Ih-Il)/(Ch-Cl))*(C-Cl)+ Il
  
  console.log('C', C);
  console.log('IH', Ih);
  console.log('IL', Il);
  console.log('CH', Ch);
  console.log('CL', Cl);
  console.log('I', I);

  var category = getCategory(I)
  return [Math.round(I), category]
}

function alertFunc() {
  axios.get("https://www.purpleair.com/json?show=37399")
  .then(data => {
    var obj = JSON.parse (data.data.results[0].Stats)
    var obj_2 = JSON.parse (data.data.results[1].Stats)
    data.data.results[0].Stats = obj
    data.data.results[1].Stats = obj_2
    var concentration = data.data.results[0].Stats.v1
    var time = data.data.results[0].Stats.lastModified
    var [aqi, category] = getAqi(concentration)
    console.log (category + " with aqi of " + aqi + '\n');
    database.collection("readings").add(data.data);

var aqis = {
  aqi: aqi, 
  category: category, 
  concentration: concentration,
  timestamp: time,
};

database.collection("aqis").add(aqis);

  }).catch(err => {
    console.log(err)
  });
}

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))