import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";

export default function AddDriver() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ driver_name: "", phone_number: "", motorcycle_plate: "", national_id: "", address: "" });

  async function submit(e) {
    e.preventDefault();
    await api.post("/drivers", form);
    toast.success("Driver added");
    navigate("/drivers");
  }

  return (
    <div className="glass mx-auto max-w-3xl rounded-lg p-6">
      <h1 className="mb-5 text-2xl font-extrabold text-white">Add Driver</h1>
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        {Object.keys(form).map((key) => (
          <input key={key} className="input" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={key.replaceAll("_", " ")} required={key !== "address"} />
        ))}
        <button className="btn-primary md:col-span-2">Save Driver</button>
      </form>
    </div>
  );
}
