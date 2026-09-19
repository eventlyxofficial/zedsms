import { api } from "./client";

// Get available services (SMS providers)
export async function getServices() {
  try {
    return api.get("/mobile-number-providers");
  } catch (err) {
    throw new Error("Failed to get services");
  }
}

// Get specific service details
export async function getServiceDetails(serviceId) {
  try {
    return api.get(`/mobile-number-providers/${serviceId}`);
  } catch (err) {
    throw new Error("Failed to get service details");
  }
}

// Get service pricing
export async function getServicePricing(serviceId) {
  try {
    return api.get(`/services/${serviceId}/pricing`);
  } catch (err) {
    throw new Error("Failed to get service pricing");
  }
}
