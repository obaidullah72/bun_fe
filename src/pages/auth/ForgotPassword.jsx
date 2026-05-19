import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordApi } from "../../api/auth.api.js";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthField from "../../components/auth/AuthField.jsx";
import { authButtonClass, authFooterLinkClass } from "../../components/auth/authInputClasses.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await forgotPasswordApi({ email });
      toast.success(res.data.message);
      if (res.data.data?.resetUrl) setResetUrl(res.data.data.resetUrl);
    } catch {
      toast.error("Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="We'll send you a link to reset your password"
      footer={
        <p className="text-center text-sm text-slate-500">
          <Link to="/login" className={authFooterLinkClass}>
            Back to login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          field="email"
          name="email"
          value={email}
          onChange={function (e) { setEmail(e.target.value); }}
          required
        />
        <button type="submit" disabled={loading} className={authButtonClass}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        {resetUrl && (
          <p className="rounded-xl border border-green-100 bg-green-50 p-3 text-xs leading-relaxed break-all text-green-700">
            Dev reset URL: {resetUrl}
          </p>
        )}
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;
