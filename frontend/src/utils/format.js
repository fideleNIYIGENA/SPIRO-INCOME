export const currency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(Number(value || 0));

export const dateOnly = (value) => String(value || "").slice(0, 10);
