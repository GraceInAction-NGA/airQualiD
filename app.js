const SensorPollingService = require('./services/SensorPollingService');
const express = require('express');
const firebase = require('./services/FirebaseService');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded());

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
  console.log(req);
});

app.post('/sensor', (req, res) => {
  console.log(req.body);
  //TODO Handle Success and Error States
  firebase.database.collection('sensors').add(req.body)
  .then(ref => {
    console.log('Added document with ID: ', ref.id);
    res.sendStatus(200);
  })
  .catch(err => {
    console.log('Failed to add document: ', err);
    res.sendStatus(400);
  });
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  SensorPollingService.run();
});