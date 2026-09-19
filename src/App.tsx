import { useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Portal from "./pages/Portal";
import { SignInPage, SignUpPage } from "./pages/Auth";
import { EmailVerificationPage } from "./pages/EmailVerification";
import { OTPVerificationPage } from "./pages/OTPVerification";
import { AuthProvider } from "./portal/context/AuthContext";
import { ProtectedRoute } from "./portal/components/ProtectedRoute";

const queryClient = new QueryClient();

// Start each page at the top instead of keeping the previous scroll position
function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/auth/verify-email" element={<EmailVerificationPage />} />
            <Route path="/auth/verify-otp" element={<OTPVerificationPage />} />
            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
                  <Portal />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
