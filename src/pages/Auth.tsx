import React from "react";
import { useNavigate } from "react-router-dom";

// Demo credentials
const DEMO = {
  existingEmail: "alex.mercer@gmail.com",
  validPassword: "Password1",
  code: "123456",
};

const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const pwChecks = (p: string) => ({
  len: p.length >= 8,
  upper: /[A-Z]/.test(p),
  lower: /[a-z]/.test(p),
  num: /[0-9]/.test(p),
});
const pwStrongEnough = (p: string) => Object.values(pwChecks(p)).every(Boolean);

// ============ SIGN IN PAGE ============
function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [banner, setBanner] = React.useState<{ type: string; message: string } | null>(null);
  const [attempts, setAttempts] = React.useState(0);
  const locked = attempts >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;

    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    else if (!emailValid(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    // Demo validation
    if (email.toLowerCase() === DEMO.existingEmail && password === DEMO.validPassword) {
      setBanner(null);
      setTimeout(() => navigate("/app/home"), 300);
      return;
    }

    setAttempts((a) => a + 1);
    const remainingAttempts = 3 - attempts - 1;
    setBanner({ type: "error", message: remainingAttempts > 0 ? `Incorrect credentials. ${remainingAttempts} attempts left.` : "Too many failed attempts. Try again later." });
  };

  return (
    <div className="min-h-screen bg-[#f9f9fa] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-8 bg-[#2155f5] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <span className="font-display font-semibold text-xl">ZEDSMS</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e1e2e9]">
          <h1 className="font-display font-semibold text-2xl mb-2">Welcome back</h1>
          <p className="text-[#494c52] text-sm mb-6">Sign in to manage your numbers and messages.</p>

          {banner && (
            <div className={`p-4 rounded-lg mb-6 text-sm ${banner.type === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>
              {banner.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B6F76] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={locked}
                className={`w-full h-11 px-3 rounded-lg border font-sans text-sm transition-colors ${
                  errors.email
                    ? "border-red-500"
                    : "border-[#E1E2E7] focus:border-[#2155f5] focus:ring-2 focus:ring-[#eef1fb]"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B6F76] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={locked}
                className={`w-full h-11 px-3 rounded-lg border font-sans text-sm transition-colors ${
                  errors.password
                    ? "border-red-500"
                    : "border-[#E1E2E7] focus:border-[#2155f5] focus:ring-2 focus:ring-[#eef1fb]"
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={locked}
              className="w-full bg-[#2155f5] hover:bg-[#1a46d1] disabled:opacity-50 text-white font-display font-medium py-3 rounded-full transition-colors mt-6 cursor-pointer"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#6B6F76]">Don't have an account? </span>
            <button onClick={() => navigate("/auth/signup")} className="text-[#2155f5] hover:underline font-medium">
              Sign up
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#9CA1A9] mt-6">
          By continuing you agree to ZEDSMS's Terms of Service and Privacy Policy.
        </p>

        {/* Demo info */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-[#2155f5]">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>Email: alex.mercer@gmail.com</p>
          <p>Password: Password1</p>
        </div>
      </div>
    </div>
  );
}

// ============ SIGN UP PAGE ============
function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const checks = pwChecks(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = "Email is required";
    else if (!emailValid(email)) newErrors.email = "Enter a valid email";
    else if (email.toLowerCase() === DEMO.existingEmail) newErrors.email = "Account already exists with this email";

    if (!password) newErrors.password = "Password is required";
    else if (!pwStrongEnough(password)) newErrors.password = "Password doesn't meet requirements";

    if (confirm !== password) newErrors.confirm = "Passwords don't match";

    if (!agreed) newErrors.agreed = "You must agree to continue";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    // Proceed to verification
    navigate("/app/home");
  };

  return (
    <div className="min-h-screen bg-[#f9f9fa] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-8 bg-[#2155f5] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <span className="font-display font-semibold text-xl">ZEDSMS</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e1e2e9]">
          <h1 className="font-display font-semibold text-2xl mb-2">Create your account</h1>
          <p className="text-[#494c52] text-sm mb-6">Get a number in minutes. No name or username needed.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B6F76] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full h-11 px-3 rounded-lg border font-sans text-sm transition-colors ${
                  errors.email ? "border-red-500" : "border-[#E1E2E7] focus:border-[#2155f5]"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B6F76] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full h-11 px-3 rounded-lg border font-sans text-sm transition-colors ${
                  errors.password ? "border-red-500" : "border-[#E1E2E7] focus:border-[#2155f5]"
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

              {/* Password requirements */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className={checks.len ? "text-green-600" : "text-[#9CA1A9]"}>✓ 8+ characters</div>
                <div className={checks.upper ? "text-green-600" : "text-[#9CA1A9]"}>✓ One uppercase</div>
                <div className={checks.lower ? "text-green-600" : "text-[#9CA1A9]"}>✓ One lowercase</div>
                <div className={checks.num ? "text-green-600" : "text-[#9CA1A9]"}>✓ One number</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B6F76] mb-2">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={`w-full h-11 px-3 rounded-lg border font-sans text-sm transition-colors ${
                  errors.confirm ? "border-red-500" : "border-[#E1E2E7] focus:border-[#2155f5]"
                }`}
              />
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
            </div>

            <label className="flex items-start gap-2 text-sm text-[#6B6F76]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 cursor-pointer accent-[#2155f5]"
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
            {errors.agreed && <p className="text-red-500 text-xs">{errors.agreed}</p>}

            <button
              type="submit"
              className="w-full bg-[#2155f5] hover:bg-[#1a46d1] text-white font-display font-medium py-3 rounded-full transition-colors mt-6 cursor-pointer"
            >
              Create account
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#6B6F76]">Already have an account? </span>
            <button onClick={() => navigate("/auth/signin")} className="text-[#2155f5] hover:underline font-medium">
              Sign in
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#9CA1A9] mt-6">
          By continuing you agree to ZEDSMS's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export { SignInPage, SignUpPage };
