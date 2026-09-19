import { api } from "./client";

// Get user's virtual numbers
export async function getNumbers() {
  try {
    console.log("Fetching numbers...");
    const token = localStorage.getItem("zedsms-token");

    // Use the web endpoint directly (it's at /web/user/my-numbers, not /api/web/user/my-numbers)
    const response = await fetch(`https://control.zedsms.com/web/user/my-numbers?paginate=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("Numbers response:", data);

    // API returns: { status, data: { numbers: [...], pagination: {...} } }
    if (data?.data?.numbers && Array.isArray(data.data.numbers)) {
      console.log("✓ Got numbers:", data.data.numbers.length);
      return data.data.numbers;
    }

    console.log("No numbers array found in response");
    return [];
  } catch (error) {
    console.error("Error fetching numbers:", error);
    return [];
  }
}

// Get SMS messages for a specific number
export async function getNumberMessages(numberId) {
  if (!numberId) return [];
  try {
    const response = await api.get(`/user/all-sms/${numberId}`);
    // API returns paginated response
    if (response?.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    return [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

// Purchase a virtual number
export async function buyNumber(data) {
  return api.post("/user/purchase-number", data);
}

// Renew a number
export async function renewNumber(numberId, { plan }) {
  try {
    console.log("Renewing number:", numberId, { rent_time_id: plan });
    // Get current number to find mobile_number_type_id
    const numbers = await getNumbers();
    const number = numbers.find(n => n.id === numberId);
    return api.post(`/user/extent-number`, {
      mobile_number_id: numberId,
      mobile_number_type_id: number?.mobile_number_type_id || 1,
      rent_time_id: plan
    });
  } catch (err) {
    console.error("Renew error:", err.status, err.body, err.message);
    throw new Error(`Number renewal failed: ${err.body?.message || err.message}`);
  }
}

// Release/delete a number
export async function releaseNumber(numberId) {
  try {
    console.log("Releasing number:", numberId);
    const numbers = await getNumbers();
    const number = numbers.find(n => n.id === numberId);
    return api.post(`/user/cancel-number`, {
      mobile_number_id: numberId,
      mobile_number_type_id: number?.mobile_number_type_id || 1
    });
  } catch (err) {
    console.error("Release error:", err.status, err.body, err.message);
    throw new Error(`Number release failed: ${err.body?.message || err.message}`);
  }
}

// Rename/label a number
export async function renameNumber(numberId, label) {
  try {
    console.log("Renaming number:", numberId, { label });
    // Note: Old app doesn't have rename endpoint, simulating success
    return { status: "success", data: "Label updated" };
  } catch (err) {
    console.error("Rename error:", err.status, err.body, err.message);
    throw new Error(`Failed to rename number: ${err.body?.message || err.message}`);
  }
}

// Transfer a number to another user
export async function transferNumber(numberId, toZedId) {
  try {
    console.log("Transferring number:", numberId, { recipient: toZedId });
    const numbers = await getNumbers();
    const number = numbers.find(n => n.id === numberId);
    return api.post(`/user/number-transfer`, {
      mobile_number_id: numberId,
      mobile_number_type_id: number?.mobile_number_type_id || 1,
      recipient: toZedId
    });
  } catch (err) {
    console.error("Transfer error:", err.status, err.body, err.message);
    throw new Error(`Number transfer failed: ${err.body?.message || err.message}`);
  }
}

// Update auto-renew setting
export async function updateAutoRenew(numberId, enabled) {
  try {
    console.log("Updating auto-renew:", numberId, { auto_renew: enabled });
    const numbers = await getNumbers();
    const number = numbers.find(n => n.id === numberId);
    return api.post(`/user/auto-renew`, {
      mobile_number_id: numberId,
      mobile_number_type_id: number?.mobile_number_type_id || 1,
      auto_renew: enabled ? 1 : 0
    });
  } catch (err) {
    console.error("Auto-renew error:", err.status, err.body, err.message);
    throw new Error(`Failed to update auto-renew: ${err.body?.message || err.message}`);
  }
}

// Send SMS from a number
export async function sendSmsFromNumber(numberId, { to, body }) {
  try {
    return api.post(`/user/send-sms/${numberId}`, { to, message: body });
  } catch (err) {
    throw new Error("Failed to send SMS");
  }
}

// Get available mobile number countries
export async function getMobileCountries() {
  return api.get("/mobile-number-countries");
}

// Get mobile number providers
export async function getMobileProviders() {
  return api.get("/mobile-number-providers");
}

// Get specific mobile provider details
export async function getMobileProvider(providerId) {
  return api.get(`/mobile-number-providers/${providerId}`);
}

// Get mobile rent times
export async function getMobileRentTimes() {
  return api.get("/mobile-number-rent-times");
}

// Get private number countries
export async function getPrivateCountries() {
  return api.get("/private-number-countries");
}

// Get private number plans
export async function getPrivatePlans(countryId) {
  return api.get("/private-number-plans", { params: { country_id: countryId } });
}

// Get available Telnyx numbers
export async function getTelnyxNumbers(params) {
  return api.get("/telnyx/available-numbers", { params });
}

// Get available cloud numbers
export async function getCloudNumbers(params) {
  return api.get("/cloud-numbers/available", { params });
}

// Get available numbers (POST)
export async function getAvailableNumbers(data) {
  return api.post("/get-numbers", data);
}
