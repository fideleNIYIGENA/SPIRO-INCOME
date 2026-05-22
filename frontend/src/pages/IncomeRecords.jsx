import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import api from "../api/client";
import Modal from "../components/Modal";
import { currency, dateOnly } from "../utils/format";

const empty = { driver_id: "", amount: "", payment_date: new Date().toISOString().slice(0, 10), payment_time: new Date().toTimeString().slice(0, 5), notes: "" };

export default function IncomeRecords() {
  const [records, setRecords] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const load = () => api.get(`/income?search=${encodeURIComponent(query)}&limit=50`).then((res) => setRecords(res.data.data));

  useEffect(() => {
    load();
    api.get("/drivers?limit=100").then((res) => setDrivers(res.data.data));
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (modal.id) await api.put(`/income/${modal.id}`, modal);
    else await api.post("/income", modal);
    toast.success(modal.id ? "Income updated" : "Income recorded");
    setModal(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this income record?")) return;
    await api.delete(`/income/${id}`);
    toast.success("Income deleted");
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><FaSearch className="absolute left-4 top-4 text-slate-500" /><input className="input pl-11" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by driver or plate" /></div>
        <button className="btn-secondary" onClick={load}>Search</button>
        <button className="btn-primary" onClick={() => setModal(empty)}><FaPlus /> Add Income</button>
      </div>
      <div className="glass overflow-hidden rounded-lg">
        <table className="w-full min-w-[850px] text-left">
          <thead className="bg-slate-950/70 text-xs uppercase text-slate-400"><tr><th className="table-cell">Driver</th><th className="table-cell">Plate</th><th className="table-cell">Amount</th><th className="table-cell">Date</th><th className="table-cell">Time</th><th className="table-cell">Notes</th><th className="table-cell">Actions</th></tr></thead>
          <tbody>{records.map((r) => <tr key={r.id} className="border-t border-slate-800 hover:bg-slate-900/40"><td className="table-cell font-semibold text-white">{r.driver_name}</td><td className="table-cell">{r.motorcycle_plate}</td><td className="table-cell text-cyan-300">{currency(r.amount)}</td><td className="table-cell">{dateOnly(r.payment_date)}</td><td className="table-cell">{r.payment_time}</td><td className="table-cell">{r.notes}</td><td className="table-cell flex gap-2"><button className="btn-secondary !p-3" onClick={() => setModal({ ...r, payment_date: dateOnly(r.payment_date), payment_time: String(r.payment_time).slice(0, 5) })}><FaEdit /></button><button className="btn-secondary !p-3 text-rose-200" onClick={() => remove(r.id)}><FaTrash /></button></td></tr>)}</tbody>
        </table>
      </div>
      {modal && (
        <Modal title={modal.id ? "Edit Income" : "Record Income"} onClose={() => setModal(null)}>
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <select className="input" value={modal.driver_id} onChange={(e) => setModal({ ...modal, driver_id: e.target.value })} required>
              <option value="">Select driver</option>
              {drivers.map((d) => <option key={d.id} value={d.id}>{d.driver_name} - {d.motorcycle_plate}</option>)}
            </select>
            <input className="input" type="number" min="1" step="0.01" value={modal.amount} onChange={(e) => setModal({ ...modal, amount: e.target.value })} placeholder="Amount paid" required />
            <input className="input" type="date" value={modal.payment_date} onChange={(e) => setModal({ ...modal, payment_date: e.target.value })} required />
            <input className="input" type="time" value={modal.payment_time} onChange={(e) => setModal({ ...modal, payment_time: e.target.value })} required />
            <textarea className="input md:col-span-2" value={modal.notes || ""} onChange={(e) => setModal({ ...modal, notes: e.target.value })} placeholder="Notes" />
            <button className="btn-primary md:col-span-2">Save Income</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
