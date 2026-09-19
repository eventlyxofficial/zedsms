import { api } from "./client";

// Normalize user data from API response to app format
function normalizeUser(user) {
  return {
    ...user,
    // Ensure balance is a number
    balance: typeof user.balance === 'string' ? parseFloat(user.balance) : (user.balance || 0),
    // Map zedsms_id to zedId for consistency
    zedId: user.zedsms_id || user.id,
  };
}

export async function login({ login, password }) {
  const res = await api.post("/login", { login, password });
  if (res?.data?.token && res?.data?.user) {
    const normalizedUser = normalizeUser(res.data.user);
    localStorage.setItem("zedsms-token", res.data.token);
    localStorage.setItem("zedsms-user", JSON.stringify(normalizedUser));
    return { ...res.data, user: normalizedUser };
  }
  throw new Error(res?.message || "Login failed");
}

export async function signup({ email, password, password_confirmation }) {
  const res = await api.post("/register", {
    email,
    password,
    password_confirmation,
  });
  if (res?.data?.token && res?.data?.user) {
    const normalizedUser = normalizeUser(res.data.user);
    localStorage.setItem("zedsms-token", res.data.token);
    localStorage.setItem("zedsms-user", JSON.stringify(normalizedUser));
    return { ...res.data, user: normalizedUser };
  }
  throw new Error(res?.message || "Signup failed");
}

export async function loginWithGoogle({ credential }) {
  const res = await api.post("/social/google", { credential });
  if (res?.data?.token && res?.data?.user) {
    const normalizedUser = normalizeUser(res.data.user);
    localStorage.setItem("zedsms-token", res.data.token);
    localStorage.setItem("zedsms-user", JSON.stringify(normalizedUser));
    return { ...res.data, user: normalizedUser };
  }
  throw new Error(res?.message || "Google login failed");
}

export async function verifyOtp({ otp }) {
  const res = await api.post("/verifyOtp", { otp });
  if (res?.data?.token && res?.data?.user) {
    const normalizedUser = normalizeUser(res.data.user);
    localStorage.setItem("zedsms-token", res.data.token);
    localStorage.setItem("zedsms-user", JSON.stringify(normalizedUser));
    return { ...res.data, user: normalizedUser };
  }
  throw new Error(res?.message || "OTP verification failed");
}

export async function getMe() {
  // User info is already available from login response
  // Data is cached in localStorage from login/signup
  const userJson = localStorage.getItem("zedsms-user");
  if (!userJson) return null;
  const user = JSON.parse(userJson);
  // Ensure normalization even if cached data is old
  return normalizeUser(user);
}

export function logout() {
  localStorage.removeItem("zedsms-token");
  localStorage.removeItem("zedsms-user");
}
