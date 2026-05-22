import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { FaCalendarAlt, FaMoneyBillWave, FaUsers, FaWallet } from "react-icons/fa";
import api from "../api/client";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";
import { currency, dateOnly } from "../utils/format";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/dashboard").then((res) => setData(res.data)); }, []);
  if (!data) return <Spinner />;

  const chart = {
    labels: data.chart.map((x) => dateOnly(x.label)),
    datasets: [{ label: "Income", data: data.chart.map((x) => x.total), backgroundColor: "#22d3ee", borderRadius: 8 }]
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total income today" value={currency(data.totals.today)} icon={FaWallet} />
        <StatCard title="Total income this week" value={currency(data.totals.week)} icon={FaCalendarAlt} accent="from-emerald-300 to-cyan-500" />
        <StatCard title="Total income this month" value={currency(data.totals.month)} icon={FaMoneyBillWave} accent="from-amber-300 to-cyan-500" />
        <StatCard title="Drivers registered" value={data.totals.drivers} icon={FaUsers} accent="from-fuchsia-300 to-cyan-500" />
      </div>
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="glass rounded-lg p-5 xl:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-white">Income Overview</h2>
          <Bar data={chart} options={{ responsive: true, plugins: { legend: { labels: { color: "#cbd5e1" } } }, scales: { x: { ticks: { color: "#94a3b8" } }, y: { ticks: { color: "#94a3b8" } } } }} />
        </div>
        <div className="glass rounded-lg p-5">
          <h2 className="mb-4 text-lg font-bold text-white">Recent Transactions</h2>
          <div className="space-y-3">
            {data.recent.map((row) => (
              <div key={row.id} className="rounded-lg bg-slate-950/60 p-3">
                <div className="flex justify-between gap-3 text-sm"><b>{row.driver_name}</b><span className="text-cyan-300">{currency(row.amount)}</span></div>
                <p className="mt-1 text-xs text-slate-400">{row.motorcycle_plate} · {dateOnly(row.payment_date)} {row.payment_time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
