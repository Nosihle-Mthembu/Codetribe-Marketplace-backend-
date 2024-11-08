require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(cors());

app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      
      mode: 'payment',
      success_url: `${`http://localhost:3000`}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${`http://localhost:3000`}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Error creating checkout session');
  }
});

// Listen on a port
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
