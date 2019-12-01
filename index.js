const SensorService = require('./SensorService');
const express = require('express');

const app = express();
const PORT = 3000;
const INTERVAL = 30000;

app.get('/', (req, res) => { 
  setInterval(SensorService.getPurpleAir, INTERVAL);
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || PORT, () => console.log(`Example app listening on port ${PORT}!`))