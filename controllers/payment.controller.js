const Payment = require("../models/payment.model");
const objectId = require("../utils/objectid");
exports.addPayment = (req, res, next) => {
  if (
    !req.body.amount ||
    !req.body.date_of_payment ||
    !req.body.booking_id ||
    !req.body.guest_id
  ) {
    return res.status(400).json({
      message: "Please provide all fields",
    });
  }

  const new_id = objectId();
  const payment = new Payment({
    payment_id: new_id,
    amount: req.body.amount,
    date_of_payment: req.body.date_of_payment,
    booking_id: req.body.booking_id,
    guest_id: req.body.guest_id,
  });

  Payment.addPayment(payment, (err, payment) => {
    if (err) {
      return res.status(500).json({
        message: "Payment creation failed",
      });
    }

    return res.status(201).json({
      message: "Payment created successfully",
      payment: payment,
    });
  });
};

exports.getPayment = (req, res, next) => {
  Payment.getAll((err, payments) => {
    if (err) {
      return res.status(500).json({
        message: "Fetching payments failed",
      });
    }

    return res.status(200).json({
      message: "Payments fetched successfully",
      payments: payments,
    });
  });
};

exports.getPaymentById = (req, res, next) => {
  const paymentId = req.params.id;

  Payment.findById(paymentId, (err, payment) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Payment with id ${paymentId} not found`,
        });
      } else {
        return res.status(500).json({
          message: "Error retrieving payment with id " + paymentId,
        });
      }
    }

    return res.status(200).json({
      message: "Payment fetched successfully",
      payment: payment,
    });
  });
};

exports.getPaymentByBookingId = (req, res, next) => {
  const bookingId = req.params.id;

  Payment.getPaymentByBookingId(bookingId, (err, payment) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Payment with booking id ${bookingId} not found`,
        });
      } else {
        return res.status(500).json({
          message: "Error retrieving payment with booking id " + bookingId,
        });
      }
    }

    return res.status(200).json({
      message: "Payment fetched successfully",
      payment: payment,
    });
  });
};

exports.getPaymentByGuestId = (req, res, next) => {
  const guestId = req.params.id;

  Payment.findByGuestId(guestId, (err, payment) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Payment with guest id ${guestId} not found`,
        });
      } else {
        return res.status(500).json({
          message: "Error retrieving payment with guest id " + guestId,
        });
      }
    }

    return res.status(200).json({
      message: "Payment fetched successfully",
      payment: payment,
    });
  });
};

exports.updatePayment = (req, res, next) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log(req.body);
  Payment.updateById(req.params.id, new Payment(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No payment found with ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Payment with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.deletePayment = (req, res, next) => {
  const paymentId = req.params.id;

  Payment.remove(paymentId, (err, payment) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Payment with id ${paymentId} not found`,
        });
      } else {
        return res.status(500).json({
          message: "Could not delete payment with id " + paymentId,
        });
      }
    }

    return res.status(200).json({
      message: "Payment deleted successfully",
    });
  });
};

exports.deleteAll = (req, res, next) => {
  Payment.removeAll((err, payments) => {
    if (err) {
      return res.status(500).json({
        message: "Could not delete payments",
      });
    }

    return res.status(200).json({
      message: "Payments deleted successfully",
    });
  });
};
