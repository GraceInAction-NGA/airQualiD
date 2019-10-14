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

function getClh (C){
  if (C <=12.0)
    return {low: 0.0, high: 12.0}
  if (C <=35.4)
    return {low: 12.1, high: 35.4}
  if (C <=55.4)
    return {low: 35.5, high: 55.4}
  if (C <=150.4)
    return {low: 55.5, high: 150.4}
  if (C <=250.4)
    return {low: 150.5, high: 250.4}
  if (C <=350.4)
    return {low: 250.5, high: 350.4}
  if (C <=500.4)
    return {low: 350.5, high: 500.4}
  return {low: 500.5, high: 99999.9}
}

function getIlh (C){
  if (C <=50)
    return {low: 0, high: 50}
  if (C <=100)
    return {low: 51, high: 100}
  if (C <=150)
    return {low: 101, high: 150}
  if (C <=200)
    return {low: 151, high: 200}
  if (C <=300)
    return {low: 201, high: 300}
  if (C <=400)
    return {low: 301, high: 400}
  if (C <=500)
    return {low: 401, high: 500}
  return {low: 500, high: 900}
}

function getAqi(C){

  var Ilh = getIlh(C)

  var Clh = getClh(C)

  const I = ((Ilh.high-Ilh.low)/(Clh.high-Clh.low))*(C-Clh.low)+ Ilh.low
  
  console.log('C', C);
  console.log('ILH', Ilh);
  console.log('CLH', Clh);
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
    var realTime = data.data.results[0].Stats.v
    var tenMin = data.data.results[0].Stats.v1
    var thirtyMin = data.data.results[0].Stats.v2
    var oneHr = data.data.results[0].Stats.v3
    var sixHr = data.data.results[0].Stats.v4
    var twentyfourHr = data.data.results[0].Stats.v5
    var oneWk = data.data.results[0].Stats.v6
    var time = data.data.results[0].Stats.lastModified

    var [aqi_1, category_1] = getAqi(realTime)
    var [aqi_2, category_2] = getAqi(tenMin)
    var [aqi_3, category_3] = getAqi(thirtyMin)
    var [aqi_4, category_4] = getAqi(oneHr)
    var [aqi_5, category_5] = getAqi(sixHr)
    var [aqi_6, category_6] = getAqi(twentyfourHr)
    var [aqi_7, category_7] = getAqi(oneWk)
    console.log (category_6 + " with aqi of " + aqi_6 + '\n');
    database.collection("readings").add(data.data);

var aqis = {
  aqi: {
    realTime: aqi_1,
    tenMin: aqi_2,
    thirtyMin: aqi_3,
    oneHr: aqi_4,
    sixHr: aqi_5,
    twentyfourHr: aqi_6,
    oneWk: aqi_7,
  },
  category: {
    realTime: category_1,
    tenMin: category_2,
    thirtyMin: category_3,
    oneHr: category_4,
    twentyfourHr: category_5,
    oneWk: aqi_7,
  },
  concentration: twentyfourHr,
  timestamp: time,
};

database.collection("aqis").add(aqis);

  }).catch(err => {
    console.log(err)
  });
}

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))