import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginApi } from "../../api/auth.api.js";
import { useAuthStore } from "../../store/authStore.js";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthField from "../../components/auth/AuthField.jsx";
import { authButtonClass, authFooterLinkClass } from "../../components/auth/authInputClasses.js";

function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(function (state) { return state.setAuth; });

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await loginApi(form);
      const { user, accessToken } = response.data.data;
      setAuth({ user, accessToken });
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your shop inventory"
      footer={
        <p className="text-center text-sm text-slate-500">
          No account?{" "}
          <Link to="/register" className={authFooterLinkClass}>
            Register
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          field="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <AuthField
          field="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <div className="flex justify-end pt-1">
          <Link to="/forgot-password" className={`text-sm ${authFooterLinkClass}`}>
            Forgot password?
          </Link>
        </div>
        <button type="submit" disabled={loading} className={`${authButtonClass} mt-2`}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
