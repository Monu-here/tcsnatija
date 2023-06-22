const cheerio = require("cheerio");
const Data = require("./data");
const { default: axios } = require("axios");

class Tcs extends Data {
  name = "tsc_natijaharu";
  URL = "https://tsc.gov.np/natijaharu";

  async fetchInnerPage(url) {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);
      const ele = $(".project-dp-one a")[0];
      return ele.attribs.href;
    } catch (error) {
      return null;
    }
  }

  async saveData() {
    try {
      const html = await this.getData();

      let dataNotice = [];
      let dataAds = [];
      let dataResult = [];
      const $ = cheerio.load(html);
      const elements = $("#tab1 table tbody tr");
      for (let index = 0; index < elements.length; index++) {
        const el = elements[index];
        const ele = $(el).find("a");
        const title = ele.text().trim();
        const localURL = "https://tsc.gov.np" + ele.attr("href");

        const url = await this.fetchInnerPage(localURL);

        if (url) {
          dataNotice.push({
            title,
            url,
            image: "",
            category: "tsc",
            topic: "tsc_notice",
          });
        }
      }

      this.save(dataNotice, "tcs_notice");

      // const $ = cheerio.load(html);
      const ads = $("#tab2  table tbody tr");
      for (let index = 0; index < ads.length; index++) {
        const el = ads[index];
        const ele = $(el).find("a");
        const title = ele.text().trim();
        const localURL = "https://tsc.gov.np" + ele.attr("href");

        const url = await this.fetchInnerPage(localURL);

        if (url) {
          dataAds.push({
            title,
            url,
            image: "",
            category: "tsc",
            topic: "tsc_Ads",
          });
        }
      }

      this.save(dataAds, "tcs_Ads");

      const result = $('#tab3 table tbody tr');
      for (let index = 0; index < result.length; index++) {
        const el = result[index];
        const ele = $(el).find("a");
        const title = ele.text().trim();
        const localURL = "https://tsc.gov.np" + ele.attr("href");

        const url = await this.fetchInnerPage(localURL);
        if (url) {
          dataResult.push({
            title,
            url,
            image: "",
            category: "tsc",
            topic: "tsc_Result",
          })
        }
        
      }
      this.save(dataResult,'tcs_Result');
    } catch (err) {
      console.error(err);
    }
  }
}
const tcs = new Tcs();
tcs.saveData();
