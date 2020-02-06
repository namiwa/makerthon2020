const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

 /**
  * Returns raw html of a particular url.
  * Returns null if it fails to load.
  * @param {string} url Website url to be scraped.
  */
 async function getHtml(url) {
  try {
    const browser = await puppeteer.launch({
      args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080',
      '--incognito'
    ],
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.resourceType() === 'image')
        request.abort();
      else
        request.continue();
    });
    const response = await page.goto(url, {
      timeout: 30000,
      waitUntil: 'networkidle2',
    });
    let content = null;
    if (response._status < 400) {
      await page.waitFor(3000);
      content = await page.content(); 
    }
    await browser.close();
    return Promise.resolve(content);
  } catch (e) {
      console.log(e);
      Promise.reject(null);
  }
}

function getArefTitle(html) {
  let store = [];
  let $ = cheerio.load(html);
  $('body  div.section.page-single  div.container.text-center.mt-2.mb-5  div  div  div  div  div  div   h6  span  a').each((ind, elem) => {
    let link = elem.attribs.href;
    let text = $(elem).text().trim();
    let parent = $(elem).parents('.card-body');
    let brief = parent.find('.card-text').html();
    let ret = {
      name: text,
      link: link,
      brief: brief,
    }
    store.push(ret);
  })
  return store;
}

function storeCSV(records = []) {
  const csvWriter = createCsvWriter({
    path: 'starups.csv',
    header: [
        {id: 'name', title: 'COMPANY NAME'},
        {id: 'link', title: 'LINK'},
        {id: 'brief', title: 'REMARKS'}
    ]
  });
  csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });
}


async function main(url = "www.google.com")  {
  return await getHtml(url)
                .catch(err => console.log(err))
                .then(html => getArefTitle(html))
                .catch(err => console.log(err))
                .then(list => storeCSV(list))
}
url = 'https://launchpad.hatcher.com/portfolio-directory.php?filter_org_type=&filter_sector=&filter_cohorts=&filter_location=One-North&search_tags=&task=filter_startups&view=overview'
main(url);