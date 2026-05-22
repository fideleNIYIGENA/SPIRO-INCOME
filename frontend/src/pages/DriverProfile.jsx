import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import Spinner from "../components/Spinner";
import { currency, dateOnly } from "../utils/format";

export default function DriverProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => { api.get(`/drivers/${id}`).then((res) => setData(res.data)); }, [id]);
  if (!data) return <Spinner />;
  const total = data.history.reduce((sum, row) => sum + Number(row.amount), 0);

  return (
    <div className="space-y-6">
      <section className="glass rounded-lg p-6">
        <h1 className="text-2xl font-extrabold text-white">{data.driver.driver_name}</h1>
        <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
          <p>Phone: <b>{data.driver.phone_number}</b></p>
          <p>Plate: <b>{data.driver.motorcycle_plate}</b></p>
          <p>National ID: <b>{data.driver.national_id}</b></p>
          <p className="md:col-span-3">Address: <b>{data.driver.address || "Not provided"}</b></p>
        </div>
      </section>
      <section className="glass overflow-hidden rounded-lg">
        <div className="flex items-center justify-between p-5">
          <h2 className="font-bold text-white">Payment History</h2>
          <span className="text-cyan-300">{currency(total)}</span>
        </div>
        <table className="w-full min-w-[680px] text-left">
          <thead className="bg-slate-950/70 text-xs uppercase text-slate-400"><tr><th className="table-cell">Date</th><th className="table-cell">Time</th><th className="table-cell">Amount</th><th className="table-cell">Notes</th></tr></thead>
          <tbody>{data.history.map((r) => <tr key={r.id} className="border-t border-slate-800"><td className="table-cell">{dateOnly(r.payment_date)}</td><td className="table-cell">{r.payment_time}</td><td className="table-cell font-bold text-cyan-300">{currency(r.amount)}</td><td className="table-cell">{r.notes}</td></tr>)}</tbody>
        </table>
      </section>
    </div>
  );
}
