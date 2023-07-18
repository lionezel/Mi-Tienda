const stripe = require("stripe")(
  sk_test_51NT5sxA3IiAitvScBTSEcg1vOh9Um96myIdW4jV2cCcv5FTpPkKqXZEMv39eIUiYcuWAwaqYw6GFbQ91XV4kFZyr00hK94aXMP
);
const Pagos = require("../models/stripe");

//GENERAR INTENCION DE PAGO

const generatePaymentIntent = async ({ amount, user, payment_method }) => {
  const resPaymentIntent = await stripe.paymentIntents.create({
    amount: parseFloat(amount) * 100,
    currency: process.env.STRIPE_CURRENCY,
    payment_method_types: ["card"],
    payment_method,
    description: `Pago para la gente de Youtue -> ${user}: Pago`,
  });

  return resPaymentIntent;
};

//CONFIRMAR PAGO

const confirmPaymentIntent = async (id, token) => {
  const paymentIntent = await stripe.paymentIntents.confirm(id, {
    payment_method: token,
  });

  console.log(paymentIntent);

  return paymentIntent;
};

//CREAR FUENTE

const generatePaymentMethod = async (token) => {
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: { token },
  });

  return paymentMethod;
};

//CONSULTAR DETALLE DE LA ORDEN

const getPaymentDetail = async (id) => {
  const detailOrder = await stripe.paymentIntents.retrieve(id);
  return detailOrder;
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.body;

    //Buscamos orden en nuestra base de datos

    const resOrder = await Pagos.findOne({ localizator: id });

    //Generamos metodo de pago en Stripe

    const responseMethod = await generatePaymentMethod(token);

    //Generamos intencion de pago

    const resPaymentIntent = await generatePaymentIntent({
      amount: resOrder.amount,
      user: resOrder.name,
      payment_method: responseMethod.id,
    });

    //Actualizamos  orden con id de intencion de pago
    await Pagos.findOneAndUpdate(
      { localizator: id },
      {
        stripeId: resPaymentIntent.id,
      }
    );

    res.send({ data: resPaymentIntent });
  } catch (e) {
    console.log(e.message);
    res.status(500);
    res.send({ error: "Algo ocurrio" });
  }
};

const checkItem = async (req, res) => {
  try {
    const { id } = req.params;

    //Buscamos orden en nuestra base de datos

    const resOrder = await Pagos.findOne({ localizator: id });

    //Solicitamos a stripe que nos devuelva la informacion de la orden

    const detailStripe = await getPaymentDetail(resOrder.stripeId);

    const status = detailStripe.status.includes("succe") ? "success" : "fail";

    //Actualizamos nuestra orden con el estatus

    await Pagos.findOneAndUpdate({ localizator: id }, { status });

    res.send({ data: detailStripe });
  } catch (e) {
    console.log(e.message);
    res.status(500);
    res.send({ error: "Algo ocurrio" });
  }
};

module.exports = {
  updateItem,
  checkItem,
  confirmPaymentIntent,
};
