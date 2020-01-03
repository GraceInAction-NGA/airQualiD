const SensorPollingService = require('./services/SensorPollingService');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('./services/FirebaseService');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js',  express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect JS bootstrap
app.use('/jquery',  express.static(__dirname + '/node_modules/jquery/dist')); 

app.get('/latest', (req, res) => {
  firebase.database.collection('aqis').orderBy('timestamp', 'desc').limit(1).get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => res.send(doc.data()));
  }).catch(err => req.send({error: "Failed to retrieve data."}));
});

app.get('/sensor', (req, res) => {
  const sensorsQuery = firebase.database.collection('sensors');

  const sensorIDQuery = sensorsQuery.where("sensorID", "==", req.query.sensorID);
  const sensorNameQuery = sensorsQuery.where("sensorName", "==", req.query.sensorName);
  const sensorTypeQuery = sensorsQuery.where("sensorType", "==", req.query.sensorType);

  const data = new Set();

  sensorIDQuery.get().then(snapshot => {
    snapshot.forEach(doc => {
      const d = doc.data();
      d["id"] = doc.id;
      data.add(d);
    });
    console.log(data);
  });

  sensorNameQuery.get().then(snapshot => {
    snapshot.forEach(doc => {
      const d = doc.data();
      d["id"] = doc.id;
      data.add(d);
    });
    console.log(data);
  });

  sensorTypeQuery.get().then(snapshot => {
    snapshot.forEach(doc => {
      const d = doc.data();
      d["id"] = doc.id;
      data.add(d);
    });
    console.log(data);
  });
});

//TODO Handle Success and Error States
//TODO Handle case where sensor already exists
app.post('/sensor', async (req, res) => {
  console.log(req.body);

  try {
    const snapshot = await firebase.database.collection('sensors')
      .where("sensorID", "==", req.body.sensorID)
      .where("sensorName", "==", req.body.sensorName)
      .where("sensorType", "==", req.body.sensorType)
      .get();

    if (!snapshot.empty) {
      console.log('Sensor already exists.');
      res.sendStatus(404);
      return;
    } 
  } catch(err) {
    console.log('Failed to search for sensor: ', err);
    res.sendStatus(400);
    return;
  }

  try {
    const ref = await firebase.database.collection('sensors').add(req.body);
    console.log('Added document with ID: ', ref.id);
    res.sendStatus(200);
    return;
  } catch(err) {
    console.log('Failed to add document: ', err);
    res.sendStatus(400);
    return;
  }
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  SensorPollingService.run();
});