import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerApi } from "../../api/auth.api.js";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthField from "../../components/auth/AuthField.jsx";
import AuthSelect from "../../components/auth/AuthSelect.jsx";
import { authButtonClass, authFooterLinkClass } from "../../components/auth/authInputClasses.js";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff"
  });

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      await registerApi(form);
      toast.success("Registered successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join the inventory management system"
      footer={
        <p className="text-center text-sm text-slate-500">
          Already have account?{" "}
          <Link to="/login" className={authFooterLinkClass}>
            Login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField field="name" name="name" value={form.name} onChange={handleChange} required />
        <AuthField field="email" name="email" value={form.email} onChange={handleChange} required />
        <AuthField
          field="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        <AuthSelect name="role" value={form.role} onChange={handleChange}>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Staff">Staff</option>
          <option value="Cashier">Cashier</option>
        </AuthSelect>
        <button type="submit" disabled={loading} className={`${authButtonClass} mt-2`}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;
