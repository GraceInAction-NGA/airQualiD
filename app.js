const SensorPollingService = require('./services/SensorPollingService');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('./services/FirebaseService');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js',  express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/jquery',  express.static(__dirname + '/node_modules/jquery/dist'));

app.get('/latest', async (req, res) => {
  try {
    const query = firebase.database.collection('aqis');
    const querySnapshot = await query.orderBy('timestamp', 'desc').limit(1).get()
    querySnapshot.forEach(doc => res.send(doc.data()));
  } catch(err) {
    req.send({error: "Failed to retrieve data."});
  }
});

app.get('/sensor', async (req, res) => {
  const getDocs = async (req, key) => {
    const query = firebase.database.collection('sensors');
    const snapshot = await query.where(key, "==", req.query[key]).get();
    const datas = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      data['id'] = doc.id;
      datas.push(data);
    });
    return datas;
  }

  try {
    const sensorIDDocs = await getDocs(req, "sensorID");
    const sensorTypeDocs = await getDocs(req, "sensorType");
    const sensorNameDocs = await getDocs(req, "sensorName");

    const docs = sensorIDDocs.concat(sensorTypeDocs, sensorNameDocs);
    const uniqueDocs = [...new Set(docs)];

    res.send(uniqueDocs);
  } catch(err) {
    console.log('Failed to search for sensor: ', err);
    res.sendStatus(400);
  }
});

app.post('/sensor', async (req, res) => {
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