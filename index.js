const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const stripe = require("stripe")("sk_test_ml6mfjJq69CvQYaPlCiwdOAp");
var app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({
      extended : true
  }));

app.use(express.static(__dirname + 'public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');




app.post('/customers', (req, res) => {

    console.log(req.body)


});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
