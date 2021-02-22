const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors({ origin: '*' }));


app.use(require('./routes/geoServer'));


app.listen(3000,()=>{
    console.log('Conectado al puerto 3000');
})