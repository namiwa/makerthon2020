const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const HCCrawler = require('headless-chrome-crawler');
const fs = require('fs');

/**
 * Based on guide from https://hackernoon.com/tips-and-tricks-for-web-scraping-with-puppeteer-ed391a63d952
 * and combining the different ways to set chromium browswer instances via docker
 * issues with synchronising such features solved here https://github.com/puppeteer/puppeteer/issues/3670
 * also reading documentation will help alot
 * https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pagewaitfornavigationoptions
 * This can also emulate browsing on mobile devices? tesitng can be done here
 * https://docs.onemap.sg/#search for more accurate geolocation tagging
 * /

/**
 * Forms valid url links from scrapped hrefs.
 * @param {string} href 
 * @param {string} baseurl 
 */
function setValidUrl(href, baseurl) {
  if (href.includes('://')) {
    return href;
  } else {
    return baseurl + href;
  }
}


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

async function submitForm(url, inCont) {
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
      waitUntil: 'domcontentloaded',
    });
    console.log(response.status());
    if (response._status < 400) {
      await page.waitFor(3000);
      await page.type('#inputPostalCode', inCont);
      await Promise.all([
        page.waitForSelector('#btnSearch'),
        page.click('#btnSearch'),
      ]);
    }
    let content = await page.content();
    // would need to return both page and browser to continue
    await browser.close();
    return Promise.resolve(content);
  } catch (e) {
    console.log(e)
    return Promise.reject(e);
  }
}

function parseEventsfromCategoryPage(html, baseurl) {
  let ret = new Set();
  let $ = cheerio.load(html);
  $('.grids #spanTitle a').each( (index, element) => {
    let obj = {}
    let text = $(element).text().trim();
    let href = element.attribs.href;
    obj['link'] = setValidUrl(href, baseurl);
    obj['name'] = text;   
    let parent = $(element).parents('.grids');
    obj['location'] = parent.find('#spanLocation a').html();
    obj['startDate'] = parent.find('#spanStartDate').html();
    obj['cost'] = parent.find('#spanPrice span').html();
    obj['endDate'] = parent.find('#spanEndDate').html();
    obj['vacancy'] = parent.find('#spanVacancy').html();
    obj['timeSlot'] = parent.find('#spanTimeSlot').html();
    ret.add(obj);
  })
  return [...ret];
}

async function testPull(link, basurl) {
  let events = 
  await getHtml(link)
  .catch(err => console.log(err))
  .then(html => {
    let ret = parseEventsfromCategoryPage(html, basurl);
    console.log(ret)
    return 'yes!'
  })
  console.log(events);
}

/**
 * Main function to push stuff
 * @param {string} baseurl 
 * @param {array<string>} surlLinks 
 */
async function headlessCrawler(baseurl, surlLinks) {
  const store = new Set();
  let ind = 0;
  const crawler = await HCCrawler.launch({
    customCrawl: async (page, crawl) => {
      // You can access the page object before requests
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.resourceType() === 'image')
          request.abort();
        else
          request.continue();
      });
      // The result contains options, links, cookies and etc.
      const result = await crawl();
      // You can access the page object after requests
      result.content = await page.content();
      const ret = parseEventsfromCategoryPage(result.content, baseurl)
      // You need to extend and return the crawled result
      return ret;
    },
    onSuccess: result => {
      console.log("success:" , ind++);
      store.add(result);
    },
  });
  await crawler.queue(surlLinks);
  await crawler.onIdle();
  await crawler.close();
  return [...store];
}


//console.log(headlessCrawler('https://www.onepa.sg/','https://www.onepa.sg/'));
//console.log(testPull('https://www.onepa.sg/cat/adventure-sports/subcat/abseiling', 'https://www.onepa.sg/'))

function parseCategoryTitle(html) {
  let ret = new Set();
  let $ = cheerio.load(html);
  $('.megaMenuContainer div ul li .mmSubmenu  div  div  div  ul .more a').each( (index, element) => {
    let rawHrefs = element.attribs.href;
    ret.add(rawHrefs);
  })
  return [...ret];
}

function parseCategoryHtmltoLinks(html, baseurl) {
  let ret = new Set();
  let $ = cheerio.load(html);
  $('.subCategoryList.clearfix a').each( (index, element) => {
    let urlLinks = setValidUrl(element.attribs.href, baseurl);
    let inner = $(element).text().trim();
    ret.add(urlLinks);
  })
  return [...ret];
}



/**
 * 
 * @param {array<string>} hrefList 
 * @returns {array<string>} Valid urls, with href appended to baseurl
 */
function parseHrefstoLinks(hrefList, baseurl) {
  let links = hrefList.map( (href)  => {
    let catUrl = setValidUrl(href, baseurl)
    return catUrl; 
  })
  return links;
}

/**
 * 
 * @param {string} baseurl base website url (homepage)
 * @param {string} surl scrapped website url
 */
async function main(baseurl, surl) {
  try {
    let catLinks = await getHtml(surl)
          .catch(err => console.log(err))
          .then(html => parseCategoryTitle(html))
          .then(catHrefs => parseHrefstoLinks(catHrefs, baseurl))
    let allCat = await Promise.all(catLinks.map(async link => {
      return await getHtml(link)
                    .catch(err => console.log(err))
                    .then(html => parseCategoryHtmltoLinks(html, baseurl))
    }))
    //allCat object contains name of category and valid url link to that page
    allCat = allCat.flat();
    console.log(allCat)
    const events = await headlessCrawler(baseurl, allCat);
    let data = JSON.stringify(events);
    fs.writeFile("store.json", data, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  }); 
  } catch (e) {
    console.log(e);
  }
}

// Asynchronous functions for doing form submission and quering for all hrefs in achor tags
// would require more tweaking based on this (either get user to input, or get estimate from api)
//console.log(submitForm('https://sis.pa-apps.sg/NASApp/sim/AdvancedSearch.aspx', '521125'));

main('https://www.onepa.sg/', 'https://www.onepa.sg/');

function clientGeolocate() {
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords.latitude, position.coords.longitude);
  });
}