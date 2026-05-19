import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerApi } from "../../api/auth.api.js";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff"
  });

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await registerApi(form);
      toast.success("Registered successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="Cashier">Cashier</option>
          </select>

          <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white">
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have account?{" "}
          <Link to="/login" className="font-medium text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;