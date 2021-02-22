const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const GeoJSON = require('geojson');



 // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(require('./routes/farmacias'));
app.use(require('./routes/establecimientos_salud'));





app.listen(3000,()=>{
    console.log('Conectado al puerto 3000');
})
