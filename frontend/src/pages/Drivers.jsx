import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaEye, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import api from "../api/client";
import Modal from "../components/Modal";
import { dateOnly } from "../utils/format";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const load = () => api.get(`/drivers?search=${encodeURIComponent(search)}&limit=50`).then((res) => setDrivers(res.data.data));
  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm("Delete this driver and their payment history?")) return;
    await api.delete(`/drivers/${id}`);
    toast.success("Driver deleted");
    load();
  }

  async function save(e) {
    e.preventDefault();
    await api.put(`/drivers/${editing.id}`, editing);
    toast.success("Driver updated");
    setEditing(null);
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-4 text-slate-500" />
          <input className="input pl-11" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} placeholder="Search drivers, phone, plate, national ID" />
        </div>
        <button className="btn-secondary" onClick={load}>Search</button>
        <Link className="btn-primary" to="/drivers/new"><FaPlus /> Add Driver</Link>
      </div>
      <div className="glass overflow-hidden rounded-lg">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-slate-950/70 text-xs uppercase text-slate-400">
            <tr><th className="table-cell">Driver</th><th className="table-cell">Phone</th><th className="table-cell">Plate</th><th className="table-cell">National ID</th><th className="table-cell">Created</th><th className="table-cell">Actions</th></tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id} className="border-t border-slate-800/80 hover:bg-slate-900/40">
                <td className="table-cell font-semibold text-white">{d.driver_name}</td>
                <td className="table-cell">{d.phone_number}</td>
                <td className="table-cell">{d.motorcycle_plate}</td>
                <td className="table-cell">{d.national_id}</td>
                <td className="table-cell">{dateOnly(d.created_at)}</td>
                <td className="table-cell flex gap-2">
                  <Link className="btn-secondary !p-3" to={`/drivers/${d.id}`}><FaEye /></Link>
                  <button className="btn-secondary !p-3" onClick={() => setEditing(d)}><FaEdit /></button>
                  <button className="btn-secondary !p-3 text-rose-200" onClick={() => remove(d.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <Modal title="Edit Driver" onClose={() => setEditing(null)}>
          <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
            {["driver_name", "phone_number", "motorcycle_plate", "national_id", "address"].map((key) => (
              <input key={key} className="input" value={editing[key] || ""} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} placeholder={key.replaceAll("_", " ")} required={key !== "address"} />
            ))}
            <button className="btn-primary md:col-span-2">Save Changes</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
