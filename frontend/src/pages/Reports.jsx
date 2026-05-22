import { useState } from "react";
import { FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import api from "../api/client";
import { currency, dateOnly } from "../utils/format";

export default function Reports() {
  const [filters, setFilters] = useState({ type: "daily", startDate: "", endDate: "", search: "" });
  const [report, setReport] = useState({ records: [], total: 0, count: 0 });

  async function load() {
    const params = new URLSearchParams(filters).toString();
    const res = await api.get(`/reports?${params}`);
    setReport(res.data);
  }

  function downloadBlob(content, filename, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function pdfEscape(value) {
    return String(value ?? "").replace(/[\\()]/g, "\\$&");
  }

  function exportPdf() {
    const rows = [
      "Moto Income Report",
      `Records: ${report.count}    Total: ${currency(report.total)}`,
      "",
      ...report.records.map((r) => `${r.driver_name} | ${r.motorcycle_plate} | ${dateOnly(r.payment_date)} ${r.payment_time} | ${currency(r.amount)}`)
    ];
    const text = rows.slice(0, 42).map((line, index) => `BT /F1 11 Tf 40 ${780 - index * 17} Td (${pdfEscape(line)}) Tj ET`).join("\n");
    const objects = [
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
      "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
      `5 0 obj << /Length ${text.length} >> stream\n${text}\nendstream endobj`
    ];
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object) => { offsets.push(pdf.length); pdf += `${object}\n`; });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    downloadBlob(pdf, "moto-income-report.pdf", "application/pdf");
  }

  function exportExcel() {
    const rows = report.records.map((r) => `<tr><td>${r.driver_name}</td><td>${r.motorcycle_plate}</td><td>${dateOnly(r.payment_date)}</td><td>${r.payment_time}</td><td>${r.amount}</td><td>${r.notes || ""}</td></tr>`).join("");
    const html = `<table><thead><tr><th>Driver</th><th>Plate</th><th>Date</th><th>Time</th><th>Amount</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table>`;
    downloadBlob(html, "moto-income-report.xls", "application/vnd.ms-excel");
  }

  return (
    <div className="space-y-5">
      <section className="glass rounded-lg p-5">
        <div className="grid gap-3 md:grid-cols-5">
          <select className="input" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="custom">Custom range</option>
          </select>
          <input className="input" type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} disabled={filters.type !== "custom"} />
          <input className="input" type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} disabled={filters.type !== "custom"} />
          <input className="input" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Driver or plate" />
          <button className="btn-primary" onClick={load}><FaSearch /> Generate</button>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="glass rounded-lg p-5"><p className="text-sm text-slate-400">Records</p><h3 className="text-2xl font-extrabold">{report.count}</h3></div>
        <div className="glass rounded-lg p-5"><p className="text-sm text-slate-400">Total</p><h3 className="text-2xl font-extrabold text-cyan-300">{currency(report.total)}</h3></div>
        <div className="glass flex flex-wrap items-center gap-2 rounded-lg p-5">
          <button className="btn-secondary" onClick={exportPdf}><FaFilePdf /> PDF</button>
          <button className="btn-secondary" onClick={exportExcel}><FaFileExcel /> Excel</button>
          <button className="btn-secondary" onClick={() => window.print()}><FaPrint /> Print</button>
        </div>
      </section>
      <div className="glass overflow-hidden rounded-lg">
        <table className="w-full min-w-[780px] text-left">
          <thead className="bg-slate-950/70 text-xs uppercase text-slate-400"><tr><th className="table-cell">Driver</th><th className="table-cell">Plate</th><th className="table-cell">Phone</th><th className="table-cell">Date</th><th className="table-cell">Time</th><th className="table-cell">Amount</th></tr></thead>
          <tbody>{report.records.map((r) => <tr key={r.id} className="border-t border-slate-800"><td className="table-cell">{r.driver_name}</td><td className="table-cell">{r.motorcycle_plate}</td><td className="table-cell">{r.phone_number}</td><td className="table-cell">{dateOnly(r.payment_date)}</td><td className="table-cell">{r.payment_time}</td><td className="table-cell text-cyan-300">{currency(r.amount)}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
