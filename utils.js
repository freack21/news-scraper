const fs = require("fs");

const db = [
  ...JSON.parse(fs.readFileSync("db.json")),
  ...JSON.parse(fs.readFileSync("db1.json")),
];

// fs.writeFileSync("data_berita.json", JSON.stringify(db, null, 2));

console.log(db.length);
