import { api } from "./client";

// Get user's transaction history
export async function getTransactions() {
  try {
    const response = await api.get("/user/my-transactions");
    // API returns paginated response
    if (response?.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    return [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

// Top up account balance
export async function topUp({ amount, method }) {
  return api.post("/user/topup", { amount, method });
}

// Transfer balance to another user
export async function transferBalance({ amount, toZedId }) {
  return api.post("/user/transfer-balance", { amount, to_zedsms_id: toZedId });
}

// Get payment methods
export async function getPaymentMethods() {
  try {
    return api.get("/user/payment-methods");
  } catch (err) {
    throw new Error("Failed to get payment methods");
  }
}

// Initiate payment
export async function initiatePayment({ amount, method }) {
  try {
    return api.post("/user/payment/initiate", { amount, payment_method: method });
  } catch (err) {
    throw new Error("Payment initiation failed");
  }
}
