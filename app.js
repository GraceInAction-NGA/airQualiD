const SensorPollingService = require('./services/SensorPollingService');
const express = require('express');
const firebase = require('./services/FirebaseService');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js',  express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect JS bootstrap
app.use('/jquery',  express.static(__dirname + '/node_modules/jquery/dist')); 

// app.get('/', (req, res) => {
//   res.sendFile("indesx.html");
// });

// app.get('/sensors', (req, res) => {
//   res.sendFile("senssors.html");
// });

app.get('/latest', (req, res) => {
  firebase.database.collection('aqis').orderBy('timestamp', 'desc').limit(1).get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => res.send(doc.data()));
  }).catch(err => req.send({error: "Failed to retrieve data."}));
});

app.post('/sensor', (req, res) => {
  
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  SensorPollingService.run();
});