const puppeteer = require('puppeteer-extra');
const path = require('path');   
var fs = require('fs');
const {extractHashtags} = require('../helper/ultils');
const { log } = require('console');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function uploadVideoFB(pathVideo, cookie, desc, proxy = null){

  console.log('pathVideo', pathVideo);
  console.log('cookie', cookie);
  console.log('desc', desc);
  console.log('proxy', proxy);
  puppeteer.use(StealthPlugin())
    
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-client-side-phishing-detection',
            '--disable-default-apps',
            '--disable-dev-shm-usage',
            // '--disable-extensions',
            '--disable-hang-monitor',
            '--disable-popup-blocking',
            '--disable-prompt-on-repost',
            '--disable-sync',
            '--disable-translate',
            '--metrics-recording-only',
            '--no-first-run',
            '--safebrowsing-disable-auto-update',
        ]
     });
     let page;
    if(Object.keys(proxy).length !== 0){
        const context = await browser.createIncognitoBrowserContext({ proxy: proxy.url });
        page = await context.newPage();
    }else{
        page = await browser.newPage();
    }
    
    
    if(proxy.user && proxy.password){
        await page.authenticate({proxy:user, password:password});
    }
    
    page.setDefaultNavigationTimeout(0);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');
    await page.setCookie(...cookie);

    try{
        await page.goto('https://www.tiktok.com/');
        
    } catch (error) {
        console.log(error);
        await browser.close();
        return false;
    }

    
}


module.exports = { uploadVideoFB };