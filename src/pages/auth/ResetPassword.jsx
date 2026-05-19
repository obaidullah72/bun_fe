import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordApi } from "../../api/auth.api.js";

function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const token = params.get("token") || "";

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await resetPasswordApi({ token, password });
      toast.success("Password reset successful");
      navigate("/login");
    } catch {
      toast.error("Reset failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <input type="password" required value={password} onChange={function (e) { setPassword(e.target.value); }} placeholder="New password" className="mt-4 w-full rounded-xl border px-4 py-3 dark:bg-slate-800" />
        <button type="submit" className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-white font-semibold">Reset Password</button>
        <Link to="/login" className="mt-4 block text-center text-sm text-blue-600">Back to login</Link>
      </form>
    </div>
  );
}

export default ResetPassword;
