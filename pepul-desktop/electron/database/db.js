const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dataDir = path.join(
  process.cwd(),
  "data"
);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(
  dataDir,
  "pepul.db"
);

const db = new sqlite3.Database(
  dbPath,
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        "SQLite Connected"
      );
    }
  }
);

module.exports = db;
