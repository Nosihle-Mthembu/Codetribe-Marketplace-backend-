const express = require('express');
const app = express();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;
  
  const lineItems = items.map(item => ({
    price_data: {
      currency: 'zar',
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  try {
    const { items } = req.body;
    // console.log(req.body, "twrtharhjaethretjtre");

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required and must be an array.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Start server on port 5000
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
