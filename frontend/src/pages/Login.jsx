import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaLock, FaMotorcycle } from "react-icons/fa";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "niyigenafidele84@gmail.com", password: "Spiro@2026" });
  const [resetEmail, setResetEmail] = useState("");
  const [resetForm, setResetForm] = useState({ token: "", newPassword: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.email, form.password);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || (error.request ? "Backend is not running or cannot be reached" : "Login failed");
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function forgot() {
    if (!resetEmail) return toast.error("Enter the admin email first");
    try {
      const res = await api.post("/auth/forgot-password", { email: resetEmail });
      toast.success(`Reset token: ${res.data.resetToken}`);
      setResetForm({ ...resetForm, token: res.data.resetToken });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create reset token");
    }
  }

  async function resetPassword() {
    try {
      await api.post("/auth/reset-password", resetForm);
      toast.success("Password reset successfully");
      setResetForm({ token: "", newPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not reset password");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center overflow-hidden p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass w-full max-w-md rounded-lg p-7">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-lg bg-cyan-400 text-3xl text-slate-950"><FaMotorcycle /></div>
          <h1 className="text-3xl font-extrabold text-white">Moto Income</h1>
          <p className="mt-2 text-sm text-slate-400">Secure admin access for daily motorcycle collections.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Admin email" required />
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
          <button disabled={busy} className="btn-primary w-full"><FaLock /> Login</button>
        </form>
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <p className="mb-3 text-sm font-semibold text-slate-200">Forgot password</p>
          <div className="flex gap-2">
            <input className="input" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="Admin email" />
            <button className="btn-secondary" onClick={forgot}>Reset</button>
          </div>
          <div className="mt-3 grid gap-2">
            <input className="input" value={resetForm.token} onChange={(e) => setResetForm({ ...resetForm, token: e.target.value })} placeholder="Reset token" />
            <input className="input" type="password" minLength="8" value={resetForm.newPassword} onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })} placeholder="New password" />
            <button className="btn-secondary" onClick={resetPassword}>Set New Password</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
