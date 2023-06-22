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
      
      const $ = cheerio.load(html);
      const selectors=[[1,'tcs_notice'],[2,'tsc_ads'],[3,'tsc_result']];
      for (let i = 0; i < selectors.length; i++) {
        dataNotice = [];
        const selector = selectors[i];
        const elements = $(`#tab${selector[0]} table tbody tr`);
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
              topic: selector[1],
            });
          }
        }
  
        this.save(dataNotice, selector[1]);
        
      }

    } catch (err) {
      console.error(err);
    }
  }
}
const tcs = new Tcs();
tcs.saveData();
