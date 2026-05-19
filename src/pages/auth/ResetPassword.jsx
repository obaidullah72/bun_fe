import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordApi } from "../../api/auth.api.js";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthField from "../../components/auth/AuthField.jsx";
import { authButtonClass, authFooterLinkClass } from "../../components/auth/authInputClasses.js";

function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const token = params.get("token") || "";

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await resetPasswordApi({ token, password });
      toast.success("Password reset successful");
      navigate("/login");
    } catch {
      toast.error("Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your new password below"
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
          field="newPassword"
          name="password"
          value={password}
          onChange={function (e) { setPassword(e.target.value); }}
          required
        />
        <button type="submit" disabled={loading} className={authButtonClass}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
