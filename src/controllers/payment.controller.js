import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res, next) => {
  const { amount, currency } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: currency || "usd",
    payment_method_types: ["card"]
  });

  res.status(200).json({ message: "Opration successful", clientSecret: paymentIntent.client_secret })
}