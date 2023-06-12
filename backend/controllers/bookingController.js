const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const catchAsync = require("../utils/catchAsync");
const Tour = require("../models/tourModel");
const Booking = require("../models/bookingModel");
const factory = require("./handleFactory");
const User = require("../models/userModel");

// ******************************* create booking checkout ************************************
const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;

  await Booking.create({ tour, user, price });
};

// ******************************* Controllers ************************************
// ************************* Create checkout Session and redirect ******************************
exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  // Get tour
  const tour = await Tour.findById(req.params.tourId);

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${process.env.FRONTEND_URL}/tours/${tour.id}/${tour.slug}?status=success`,
    cancel_url: `${process.env.FRONTEND_URL}/tours/${tour.id}/${tour.slug}?status=failed`,
    mode: "payment",
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "inr",
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [tour.imageCover], // Need images that are already in internet
          },
        },
      },
    ],
  });

  // send session
  res.status(200).json({ status: "SUCCESS", session });
});

// ******************************* Webhook checkout ************************************
exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
});

// ******************************* Using Factory Handler ************************************
exports.createBooking = factory.create(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.getBookingById = factory.getById(Booking);
exports.updateBookingById = factory.updateById(Booking);
exports.deleteBookingById = factory.deleteById(Booking);
