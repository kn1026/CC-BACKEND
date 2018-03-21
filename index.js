const express = require('express')
const path = require('path')
var bodyParser = require('body-parser')
var stripe = require("stripe")("sk_test_ml6mfjJq69CvQYaPlCiwdOAp")
const PORT = process.env.PORT || 5000
var app = express()
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({
      extended : true
  }));

app.post('/customers', (req, res) => {
    var email = req.body.email
    var source = req.body.source

    stripe.customers.create({
      email: email,
      source: source,
    }, function(err, customer) {
      // asynchronously called
      if(err != null) {

        console.log(err)

      }
      res.send(customer)
    })

});
