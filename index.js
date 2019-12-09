const SensorService = require('./src/Sensor/SensorService');
const express = require('express');
const firebase = require('./src/Helpers/Firebase');

const app = express();
const PORT = 3000;
const INTERVAL = 30000;

app.use(express.static(__dirname));

app.get('/', (req, res) => { 
  res.sendFile(__dirname + "/index.html");
});

app.get('/latest', (req, res) => {
  const a = firebase.database.collection('aqis').orderBy('timestamp', 'desc').limit(1).get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => res.send(doc.data()));
  }).catch(err => req.send({error: "Failed to retrieve data."}));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  setInterval(SensorService.getPurpleAir, INTERVAL);
});