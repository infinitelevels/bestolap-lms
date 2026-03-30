import axios from "axios";

async function initializePayment(email, amount, studentId) {

  try {

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        metadata: { studentId }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.data;

  } catch (error) {
    console.error("Paystack Initialization Error:", error.message);
    throw new Error("Payment initialization failed");
  }
}

export default initializePayment;
