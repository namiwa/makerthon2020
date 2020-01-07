//const puppeteer = require('puppeteer');
const axios = require('axios');
const req = require('request');
const cheerio = require('cheerio');

/**
 * Following guide from "https://levelup.gitconnected.com/web-scraping-with-node-js-c93dcf76fe2b"
 * Understanding promises (basically asychronous functions) and functions which iterates through out and array (cheerio)
 */

//Selected url to be scraped
const url = 'https://www.onepa.sg/';

/**
 * Fetches all website metadata and content from url
 */
const fetchData = async (url) => {
    const result = await axios.get(url);
    return cheerio.load(result.data);
}

/**
 * Returns a list of all the href links associated with ever <a> tag on a webpage
 * @param {Raw data collect from cheerio load call} res 
 */
const getAllHrefFromHtml = (res) => {
    const $ = cheerio.load(res.html());
    let store = []
    $('a').each( function(index, value) {
    let link = $(value).attr('href');
    store.push(link);
    })
    return store;
}

async function mainScrapper(url) {
    let store = await fetchData(url)
        .then(res => getAllHrefFromHtml(res))
        .catch((err) => console.log("something went wrong:" + err))        
    console.log(store[20]);
    let testUrl = 'https://www.onepa.sg/cat/pastry-_and_-bakery/subcat/dim-sum'
    console.log(testUrl);
    let newPage = await fetchData(testUrl)
        .then(res => {
            const $ = cheerio.load(res.html());
            $('a').each((index, value) => {
                let target = $(value).attr('target');
                console.log(target);
            })
        })
        .catch(err => {
            console.log("error in linking url" + err);
        });
    console.log(newPage);
}

mainScrapper(url);