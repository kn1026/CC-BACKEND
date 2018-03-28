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

    var email = req.body.email

    stripe.customers.create({
      email: email
    }, function(err, customer) {
      // asynchronously called
      if(err != null) {

        console.log(err)

      }
      res.send(customer)
    })

});

app.post('/customers_card', (req, res) => {

    var id = req.body.cus_id


    stripe.customers.listCards(id, function(err, cards) {

      if(err != null) {

        console.log(err)

      }
      res.send(cards)

  });



});


app.post('/card', (req, res) => {

    var id = req.body.cus_id
    var source = req.body.source

    stripe.customers.createSource(
      id,
      { source: source },
      function(err, card) {
        if(err != null) {

          console.log(err)

        }
        res.send(card)
      }
);

});

app.post('/default_card', (req, res) => {

    var id = req.body.cus_id

    stripe.customers.retrieve( id,
      function(err, customer) {

        if(err != null) {

          console.log(err)

        }
        res.send(customer.body.default_source)
  }
);

});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
