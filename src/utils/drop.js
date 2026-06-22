// src/utils/drop.js
require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, { dbName: "ceg_db" })
  .then(async () => {
    await mongoose.connection.dropDatabase();
    console.log("✅ Base ceg_db supprimée");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌", err.message);
    process.exit(1);
  });