const allowedAdmins = [
  "niyigenafidele84@gmail.com",
  "julesjulesce@gmail.com"
];

const isAllowedAdmin = (email = "") =>
  allowedAdmins.includes(String(email).trim().toLowerCase());

module.exports = { allowedAdmins, isAllowedAdmin };
