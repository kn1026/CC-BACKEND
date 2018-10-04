
const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');
const stripe = require("stripe")("sk_live_MOC1tbrlvBZENX8WMEXiLhla");
var app = express();
const PORT = process.env.PORT || 5000;

const accountSid = 'AC890d1e64b6af132a97b58edcd84acaee';
const authToken = 'c9aa2f947339f8f124e19643a955a256';
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const http = require('http');
const https = require('https');
const request = require('request');
//import checkr from ;


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

app.post('/customers_email_update', (req, res) => {

    var id = req.body.cus_id
    var email = req.body.email



    stripe.customers.update(id, {
        email: email
      }, function(err, customer) {

        if(err != null) {

          console.log(err)

        }
        res.send(customer)
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

app.post('/retrieve_bank_token', (req, res) => {

    var account_holder_name = req.body.account_holder_name
    var routing_number = req.body.routing_number
    var account_number = req.body.account_number


    stripe.tokens.create({
    bank_account: {
    country: 'US',
    currency: 'usd',
    account_holder_name: account_holder_name,
    account_holder_type: 'individual',
    routing_number: routing_number,
    account_number: account_number
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


app.post('/refund', (req, res) => {

    var refund_id = req.body.refund_key

    stripe.refunds.create({

        charge: refund_id,

      }, function(err, refund) {
          if(err != null) {

            console.log(err)

          }
            res.send(refund)
      });

});

app.post('/External_Account', (req, res) => {

    var email = req.body.email

    stripe.accounts.create({
      type: 'custom',
      country: 'US',
      email: email,
      business_name: "Campus Connect Driver",
      business_url: "http://campusconnectonline.com/"
    }, function(err, account) {
      if(err != null) {

        console.log(err)

      }
        res.send(account)
  });

});


app.post('/retrieve_connect', (req, res) => {

    var account = req.body.account

    stripe.accounts.retrieve(
      account, function(err, account) {

        if (!err) {

            res.send(account);

        } else {

            console.log(err)
        }


      }
    );

});


app.post('/login_links', (req, res) => {

    var account = req.body.account

    stripe.accounts.createLoginLink(
      account,function(err, link) {

        if (!err) {

            res.send(link);

        } else {

            console.log(err)
        }

  }
);

});

app.post('/Transfer_payment', (req, res) => {

    var price = req.body.price
    var account = req.body.account

    stripe.transfers.create({

          amount: price,
          currency: "usd",
          destination: account,

        }, function(err, transfer) {

          if (!err) {

              res.send(transfer);

          } else {

              console.log(err)
          }

        });

});

app.post('/redirect', (req, res) => {

    authorization_code = req.body.authorization_code
    console.log(authorization_code)


    request.post({

      url: 'https://connect.stripe.com/oauth/token',
      form: { code: authorization_code, grant_type: "authorization_code", client_secret: "sk_live_MOC1tbrlvBZENX8WMEXiLhla" }

    }, function(error, response, body){

      if (!error && response.statusCode == 200) {

          res.send(body);

      } else {

          console.log(error)

      }


  });


});


app.post('/checkRCreateCandidate', (req, res) => {


  API_KEY = req.body.YOUR_TEST_API_KEY
  first_name = req.body.first_name,
  no_middle_name = req.body.no_middle_name,
  last_name = req.body.last_name,
  email = req.body.email,
  phone = req.body.phone,
  zipcode = req.body.zipcode,
  ssn = req.body.ssn,
  driver_license_number = req.body.driver_license_number


  var payload = {
      first_name = first_name,
      no_middle_name = no_middle_name,
      last_name = last_name,
      email = email,
      phone = phone
      zipcode = zipcode,
      ssn = ssn,
      driver_license_number = driver_license_number
    };




    console.log(API_KEY, first_name, no_middle_name, last_name, email, phone, zipcode, ssn, driver_license_number)

    var options = {
    url: 'https://api.checkr.com/v1/candidates',
    method: 'POST',
    body: dataString,
    auth: {
        'user': API_KEY,
        'pass': ''
    }


    request(options, callback);
};


});

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        res.send(body);
    } else {

        console.log(error)

    }
}





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



    stripe.charges.create({

      customer: cus_id,
      card: source,
      amount: amount,
      currency: "usd",
      description: description,
      capture: false,
      receipt_email: receipt_email,



    }, function(err, charge) {

      if(err != null) {

        console.log(err)

      }
      res.send(charge)

  });

});

app.post('/pre_authorization_apple_pay', (req, res) => {

    var token = req.body.token
    var receipt_email = req.body.receipt_email
    var amount = req.body.amount
    var description = req.body.description


    stripe.charges.create({


      source: token,
      amount: amount,
      currency: "usd",
      description: description,
      capture: false,
      receipt_email: receipt_email,



    }, function(err, charge) {

      if(err != null) {

        console.log(err)

      }

      res.send(charge)

  });

});


app.post('/Capture_payment', (req, res) => {

    var charge_id = req.body.chargedID


    stripe.charges.capture(charge_id, function(err, charge) {


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
