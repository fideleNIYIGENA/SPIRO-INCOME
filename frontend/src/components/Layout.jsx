import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaChartPie, FaCog, FaFileAlt, FaHome, FaMoneyBillWave, FaMotorcycle, FaSignOutAlt, FaUserCircle, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const nav = [
  ["/", "Dashboard", FaHome],
  ["/drivers", "Drivers", FaUsers],
  ["/drivers/new", "Add Driver", FaMotorcycle],
  ["/income", "Income Records", FaMoneyBillWave],
  ["/reports", "Reports", FaFileAlt],
  ["/settings", "Settings", FaCog],
  ["/profile", "Profile", FaUserCircle]
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const Sidebar = (
    <aside className="glass fixed inset-y-0 left-0 z-40 w-72 p-4 lg:static lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-400 text-xl text-slate-950"><FaMotorcycle /></div>
        <div>
          <h1 className="text-xl font-extrabold text-white">Moto Income</h1>
          <p className="text-xs text-slate-400">Admin collections</p>
        </div>
      </div>
      <nav className="space-y-2">
        {nav.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>
      <button onClick={() => { logout(); navigate("/login"); }} className="mt-8 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-rose-200 hover:bg-rose-500/10">
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen lg:flex">
      <div className="hidden lg:block">{Sidebar}</div>
      {open && <div className="lg:hidden">{Sidebar}<button className="fixed inset-0 z-30 bg-black/50" onClick={() => setOpen(false)} aria-label="Close menu" /></div>}
      <main className="flex-1 p-4 lg:p-6">
        <header className="glass mb-6 flex items-center justify-between rounded-lg px-4 py-3">
          <button className="btn-secondary !p-3 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><FaBars /></button>
          <div>
            <p className="text-sm text-slate-400">Welcome back</p>
            <h2 className="font-bold text-white">{admin?.email}</h2>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-3 rounded-lg bg-slate-950/60 px-3 py-2">
            <FaUserCircle className="text-2xl text-cyan-300" />
            <span className="hidden text-sm text-slate-300 sm:inline">Admin</span>
          </motion.div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
