const { app, initializeDatabase } = require("./app");

const port = process.env.PORT || 5000;

initializeDatabase()
  .then(() => {
    app.listen(port, () => console.log(`Moto Income API running on port ${port}`));
  })
  .catch((error) => {
    console.error("Failed to initialize Moto Income database:", error.message);
    process.exit(1);
  });
