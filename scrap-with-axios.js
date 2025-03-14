const { default: axios } = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const DB_FOLDER = "result";
const DB_NAME = "db1.json";
const DB_DIR = `./${DB_FOLDER}/${DB_NAME}`;

const readDB = () => {
  try {
    if (!fs.existsSync(DB_FOLDER)) {
      fs.mkdirSync(DB_FOLDER);
    }

    if (!fs.existsSync(DB_DIR)) {
      fs.writeFileSync(DB_DIR, JSON.stringify([]));
    }

    return JSON.parse(fs.readFileSync(DB_DIR)) || [];
  } catch (error) {
    console.log(error);
  }
  return [];
};

const existInDB = (data = {}) => {
  try {
    const db = readDB();
    return db.some(
      (element) =>
        element?.title === data?.title ||
        element?.content === data?.content ||
        element?.link === data?.link
    );
  } catch (error) {
    console.log(error);
  }
  return false;
};

const saveToDB = (data = {}) => {
  try {
    let db = readDB();

    db.push(data);

    fs.writeFileSync(DB_DIR, JSON.stringify(db, null, 2));
  } catch (error) {
    console.log(error);
  }
};

console.log(readDB().length);

module.exports = {
  detik: async function () {
    try {
      let page = 1;
      while (true) {
        console.log("Page " + page);

        const searchRequest = await axios.get(
          "https://www.detik.com/search/searchnews?result_type=relevansi&query=ptpn&page=" +
            page
        );
        const $ = cheerio.load(searchRequest.data);
        const _news = [];

        const articles = $("#nhl div article div div.media__text h3 a");

        for (const el of articles) {
          const title = $(el).text();
          const link = $(el).attr("href");
          let content = "";

          try {
            const contentRequest = await axios.get(link);
            const $content = cheerio.load(contentRequest.data);
            $content(
              "body div.detail__body.itp_bodycontent_wrapper div.detail__body-text.itp_bodycontent p"
            ).each((i, el) => {
              content += $(el).text() + "\n";
            });
            content = content.trim();
          } catch (error) {
            console.log(error);
          }

          _news.push({ title, link, content });
          if (!existInDB({ title, link, content })) {
            saveToDB({ title, link, content });
          }
        }

        if (!_news.length) {
          break;
        }
        page++;
      }
      return readDB();
    } catch (error) {
      console.log(error);
    }
    return false;
  },
  cnbc: async function () {
    try {
      let page = 1;
      while (true) {
        console.log("Page " + page);

        const searchRequest = await axios.get(
          "https://www.cnbcindonesia.com/search?query=ptpn&page=" + page
        );
        const $ = cheerio.load(searchRequest.data);
        const _news = [];

        const articles = $(
          "body main div.object div div.grid.grid-cols-layout div.content-start div.flex.flex-col.gap-6 div article a"
        );

        for (const el of articles) {
          const title = $(el).find("h2").text();
          const link = $(el).attr("href");
          let content = "";

          try {
            const contentRequest = await axios.get(link);
            const $content = cheerio.load(contentRequest.data);
            $content(
              "body main div.object div div.grid.grid-cols-layout div.content-start div.flex div div p"
            ).each((i, el) => {
              content += $(el).text() + "\n";
            });
            content = content.trim();
          } catch (error) {
            console.log(error);
          }

          _news.push({ title, link, content });
          if (!existInDB({ title, link, content })) {
            saveToDB({ title, link, content });
          }
        }

        if (!_news.length) {
          break;
        }
        page++;
      }
      return readDB();
    } catch (error) {
      console.log(error);
    }
    return false;
  },
};
