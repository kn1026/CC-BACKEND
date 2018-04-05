const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const stripe = require("stripe")("sk_test_ml6mfjJq69CvQYaPlCiwdOAp");
var app = express();
const PORT = process.env.PORT || 5000;

const accountSid = 'AC890d1e64b6af132a97b58edcd84acaee';
const authToken = 'c9aa2f947339f8f124e19643a955a256';
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const http = require('http');

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
        res.send(customer)
  }
);

});

app.post('/single_card', (req, res) => {

    var Card_Id = req.body.Card_Id
    var cus_id = req.body.cus_id

    stripe.customers.retrieveCard(cus_id, Card_Id,
    function(err, card) {

      if(err != null) {

        console.log(err)

      }
      res.send(card)

    }
);

});

app.post('/retrieve_token', (req, res) => {

    var number = req.body.number
    var exp_month = req.body.exp_month
    var exp_year = req.body.exp_year
    var cvc = req.body.cvc

    stripe.tokens.create({card: {
    "number": number,
    "exp_month": exp_month,
    "exp_year": exp_year,
    "cvc": cvc
  }
}, function(err, token) {
  if(err != null) {

    console.log(err)

  }
  res.send(token)
});

});

app.post('/delete_card', (req, res) => {

    var cus_id = req.body.cus_id
    var Card_Id = req.body.Card_Id

    stripe.customers.deleteCard(cus_id,Card_Id,
      function(err, confirmation) {
        // asynchronously called
        if(err != null) {

          console.log(err)

        }
        res.send(confirmation)

      }
    );
});

app.post('/set_default', (req, res) => {

    var cus_id = req.body.cus_id
    var Card_Id = req.body.Card_Id


    stripe.customers.update(cus_id, {
        default_source: Card_Id
  }, function(err, customer) {

    if(err != null) {

      console.log(err)

    }
    res.send(customer)

  });
});

app.post('/pre_authorization', (req, res) => {

    var cus_id = req.body.cus_id
    var amount = req.body.amount
    var source = req.body.source
    var captured = req.body.captured
    var description = req.body.description
    var receipt_email = req.body.receipt_email
    var name = req.body.name


    console.log(cus_id)
    console.log(amount)
    console.log(source)
    console.log(captured)
    console.log(description)


    stripe.charges.create({

      customer: cus_id,
      card: source,
      amount: amount,
      currency: "usd",
      description: description,
      capture: false,
      receipt_email: receipt_email,
      name: name,


    }, function(err, charge) {

      if(err != null) {

        console.log(err)

      }
      res.send(charge)

  });

});


app.post('/sms_noti', (req, res) => {

    var phone = req.body.phone
    var body = req.body.body

    client.messages.create({

        to: phone,
        from: '+16194190889',
        body: body

    })
    .then((message) => console.log(message.sid));

});

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('Your driver is comming, be ready');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});







app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
