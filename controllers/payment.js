const paymentService = require("../services/payment");

const payWithCard = async (req, res) => {
  try {
    const { orderId} = req.body;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    const iframeUrl = await paymentService.handleCardPayment(orderId);

    return res.json({ iframe_url: iframeUrl });
  } catch (err) {
    console.error(err);

      if (err.message === "Order not found") {
      return res.status(404).json({ message: err.message });
    } else if (err.message === "Already paid") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports = {payWithCard};
