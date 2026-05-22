import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/client";

export default function Settings() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  async function submit(e) {
    e.preventDefault();
    await api.post("/auth/change-password", form);
    toast.success("Password changed");
    setForm({ currentPassword: "", newPassword: "" });
  }
  return (
    <div className="glass mx-auto max-w-xl rounded-lg p-6">
      <h1 className="mb-5 text-2xl font-extrabold text-white">Settings</h1>
      <form onSubmit={submit} className="space-y-4">
        <input className="input" type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} placeholder="Current password" required />
        <input className="input" type="password" minLength="8" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="New password" required />
        <button className="btn-primary w-full">Change Password</button>
      </form>
    </div>
  );
}
