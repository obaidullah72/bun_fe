import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordApi } from "../../api/auth.api.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await forgotPasswordApi({ email });
      toast.success(res.data.message);
      if (res.data.data?.resetUrl) setResetUrl(res.data.data.resetUrl);
    } catch {
      toast.error("Request failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <input type="email" required value={email} onChange={function (e) { setEmail(e.target.value); }} placeholder="Email" className="mt-4 w-full rounded-xl border px-4 py-3 dark:bg-slate-800" />
        <button type="submit" className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-white font-semibold">Send Reset Link</button>
        {resetUrl && <p className="mt-3 text-xs break-all text-green-600">Dev reset URL: {resetUrl}</p>}
        <Link to="/login" className="mt-4 block text-center text-sm text-blue-600">Back to login</Link>
      </form>
    </div>
  );
}

export default ForgotPassword;
