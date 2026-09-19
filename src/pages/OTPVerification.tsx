import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthContext } from "../portal/context/AuthContext";

export function OTPVerificationPage() {
  const navigate = useNavigate();
  const { user, verifyOtp, isVerifyOtpLoading, verifyOtpError, logout } = useAuthContext();
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [attempts, setAttempts] = React.useState(0);
  const locked = attempts >= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked || isVerifyOtpLoading) return;

    setError("");

    if (!otp || otp.length < 6) {
      setError("Please enter a valid OTP");
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        verifyOtp(
          { otp },
          {
            onSuccess: () => {
              navigate("/app/home");
              resolve();
            },
            onError: (error: any) => {
              setAttempts((a) => a + 1);
              const remaining = 3 - attempts - 1;
              if (remaining > 0) {
                setError(`Invalid OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} left.`);
              } else {
                setError("Too many failed attempts. Please try again later.");
              }
              reject(error);
            },
          }
        );
      });
    } catch (err) {
      // Error handled in callback
    }
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
              🔐
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-[20px] border border-[#e1e2e9] p-8 mb-6">
            <h1 className="font-display font-semibold text-2xl text-[#0f1013] mb-2 text-center">
              Two-Factor Authentication
            </h1>
            <p className="text-[#6B6F76] text-sm text-center mb-6">
              Enter the 6-digit code from your authenticator app to complete the login.
            </p>

            {locked && (
              <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 text-sm flex gap-3">
                <span className="text-lg">⏱️</span>
                <div>Too many failed attempts. Try again in 30 seconds.</div>
              </div>
            )}

            {!locked && error && (
              <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 text-sm flex gap-3">
                <span className="text-lg">⚠️</span>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* OTP Input */}
              <div>
                <label className="block text-xs font-semibold text-[#6B6F76] mb-2">Authentication Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  disabled={locked}
                  maxLength={6}
                  className={`w-full h-11 px-4 rounded-[11px] border text-center text-lg font-mono font-bold tracking-widest transition-colors ${
                    error && !locked
                      ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-[#E1E2E7] bg-white focus:border-[#2155f5] focus:ring-2 focus:ring-[#eef1fb]"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={locked || isVerifyOtpLoading}
                className="w-full bg-[#2155f5] hover:bg-[#1a46d1] disabled:opacity-50 text-white font-display font-medium py-3 rounded-full transition-colors mt-6 flex items-center justify-center gap-2"
              >
                {isVerifyOtpLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </form>

            {/* Help Link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  logout();
                  navigate("/auth/signin");
                }}
                className="text-[#2155f5] hover:underline text-sm font-medium"
              >
                Back to Sign In
              </button>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-xs text-[#9CA1A9]">
            Need help? Contact{" "}
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
