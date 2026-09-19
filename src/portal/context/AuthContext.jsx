import React, { createContext, useContext } from "react";
import { useAuth as useAuthHook } from "../hooks/useAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuthHook();

  // Auth state conditions
  const isLoggedIn = !!auth.user;
  const isEmailVerified = auth.user?.email_verified_at !== null;
  const has2FA = auth.user?.login_security?.google2fa_enable === 1;
  const isDisabled = auth.user?.status === 0;

  // Current auth state
  const authState = {
    isLoggedIn,
    isEmailVerified,
    has2FA,
    isDisabled,
    needsEmailVerification: isLoggedIn && !isEmailVerified,
    needs2FAVerification: isLoggedIn && isEmailVerified && has2FA,
    canAccessDashboard: isLoggedIn && isEmailVerified && !has2FA && !isDisabled,
  };

  return (
    <AuthContext.Provider value={{ ...auth, ...authState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
