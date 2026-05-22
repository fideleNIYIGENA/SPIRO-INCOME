import { FaUserShield } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { dateOnly } from "../utils/format";

export default function Profile() {
  const { admin } = useAuth();
  return (
    <div className="glass mx-auto max-w-xl rounded-lg p-6 text-center">
      <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-lg bg-cyan-400 text-4xl text-slate-950"><FaUserShield /></div>
      <h1 className="text-2xl font-extrabold text-white">{admin?.email}</h1>
      <p className="mt-2 text-slate-400">Authorized Moto Income administrator</p>
      <div className="mt-6 rounded-lg bg-slate-950/60 p-4 text-left text-sm text-slate-300">
        <p>Admin ID: <b>{admin?.id}</b></p>
        <p>Created: <b>{dateOnly(admin?.created_at)}</b></p>
      </div>
    </div>
  );
}
