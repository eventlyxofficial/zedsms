import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthContext } from "../portal/context/AuthContext";

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const [resendAfter, setResendAfter] = React.useState(0);
  const [isResending, setIsResending] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleResendEmail = async () => {
    if (resendAfter > 0) return;

    setIsResending(true);
    setMessage("");

    try {
      // Call resend verification email endpoint
      const response = await fetch("https://control.zedsms.com/api/email/send-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("zedsms-token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Verification email sent! Check your inbox.");
        // Start 2 minute cooldown
        setResendAfter(120);
      } else {
        setMessage(data.message || "Failed to resend email");
      }
    } catch (error) {
      setMessage("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Countdown timer
  React.useEffect(() => {
    if (resendAfter <= 0) return;

    const interval = setInterval(() => {
      setResendAfter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendAfter]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#f9f9fa] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[500px]">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2155f5 0%, #5B54E8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
              }}
            >
              ✉️
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-[20px] border border-[#e1e2e9] p-8 text-center mb-6">
            <h1 className="font-display font-semibold text-2xl text-[#0f1013] mb-2">
              Verify Your Email
            </h1>
            <p className="text-[#6B6F76] text-sm mb-6">
              We've sent a verification link to <strong>{user?.email}</strong>. Click the link in your email to
              activate your account.
            </p>
            <p className="text-[#9CA1A9] text-xs mb-6">
              Didn't receive the email? Check your spam folder or try resending it below.
            </p>

            {message && (
              <div
                className="mb-6 p-4 rounded-lg text-sm"
                style={{
                  background: message.includes("sent") ? "#E9F6EF" : "#FCEDEC",
                  color: message.includes("sent") ? "#1B8A5A" : "#D6453A",
                }}
              >
                {message}
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                disabled={resendAfter > 0 || isResending}
                className="w-full bg-[#2155f5] hover:bg-[#1a46d1] disabled:opacity-50 text-white font-display font-medium py-3 rounded-full transition-colors"
              >
                {isResending ? "Sending..." : resendAfter > 0 ? `Resend after ${formatTime(resendAfter)}` : "Resend Email"}
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/auth/signin");
                }}
                className="w-full bg-white border border-[#E1E2E7] text-[#2155f5] font-display font-medium py-3 rounded-full transition-colors hover:bg-[#f9f9fa]"
              >
                Back to Sign In
              </button>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-xs text-[#9CA1A9]">
            Having trouble? Contact{" "}
            <a href="mailto:support@zedsms.com" className="text-[#2155f5] hover:underline">
              support@zedsms.com
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
