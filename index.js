const __config__ = require("./config.json");
const express = require("express");
const { detik, cnbc } = require("./scrap-with-axios");
const app = express();
const PORT = __config__.port || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    code: 200,
    msg: "hello world!",
  });
});

app.get("/", (req, res) => {
  res.json({
    code: 200,
    msg: "hello world!",
  });
});

app.get("/detik", async (req, res) => {
  const detikNews = await detik();
  if (detikNews)
    res.json({
      code: 200,
      data: detikNews,
    });
  else
    res.json({
      code: 500,
      msg: "error ges",
    });
});

app.get("/cnbc", async (req, res) => {
  const cnbcNews = await cnbc();
  if (cnbcNews)
    res.json({
      code: 200,
      data: cnbcNews,
    });
  else
    res.json({
      code: 500,
      msg: "error ges",
    });
});

app.use((req, res) => {
  res.json({
    code: 404,
    msg: "route not found",
  });
});

app.listen(PORT, () => {
  console.log(`✅ running at http://localhost:${PORT}`);
});

// (async () => {
//   await cnbc();
// })();
