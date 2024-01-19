const express = require("express");
const app = express();
const bodyParser = require('body-parser')

var stripe = require('stripe')('sk_test_51O5nxNIYYpj5fzgm4PajPvJkw7Ep1Ebknew6wSpMseXdaMKnsS8cJpugkrykgFleKS9OZFrH96tDMrMavwXs0nmV00uuMvzEdr');
const port = 9000;
const cors = require('cors')
app.use(cors())
app.use(
	(req,res,next) => {
		console.log(req.originalUrl ,'<<<<<<<<<<<<<<<<<<<<<<<<<<<<,,');
	  if (req.originalUrl === '/webhook') {
		next();
	  } else {
      bodyParser.json()(req, res, next);
	  }
	}
  );

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/stripePayment", async (req, res) => {
  console.log(req.body ,'<<<<<<<<<<<<<');
  // const balance = await stripe.balance.retrieve();
  // console.log(balance,'<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,');
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: 'inr',
      payment_method: req.body.id,
      payment_method_types: ['card'],
      transfer_group: 'ORDER10',
    });

    // const transfer = await stripe.transfers.create({
    //   amount: 7000,
    //   currency: 'inr',
    //   destination: 'acct_1O5oJHI3Jke2j9vr',
    //   transfer_group: 'ORDER10',
    // });
    // console.log(transfer);
    
    return res.send({client_secret:paymentIntent.client_secret})
  } catch (error) {
    console.log(error);
  }
})

app.post('/webhook',express.raw({type:'application/json'}), (req, res) => {
  const endpointSecret = "whsec_fb2dd9678a42a5eefa843be09feca86117f544773d4f710a3143d51089afb781";
  const sig = req.headers['stripe-signature'];
  let event ;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.created':
      const paymentIntentCreated = event.data.object;
      console.log(paymentIntentCreated.status, '///////////');
      break;
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log(paymentIntentSucceeded, '<<<<<<<');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 res to acknowledge receipt of the event
  // res.send();
  res.json({received: true});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

