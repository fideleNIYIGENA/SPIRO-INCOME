import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, accent = "from-cyan-400 to-blue-500" }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-lg p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-white">{value}</h3>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br ${accent} text-slate-950`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </motion.div>
  );
}
