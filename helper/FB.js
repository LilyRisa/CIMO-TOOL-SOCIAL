
const puppeteer = require('puppeteer-extra');
const path = require('path');   
var fs = require('fs').promises;
const {extractHashtags} = require('./ultils');
const { log } = require('console');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const chromeFinder = require('chrome-finder');
const { app} = require('electron');

const {getVideoDuration} = require('./video')

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function logToConsoleAndFile(message) {
    console.log(message);
    // Ghi log vào tệp tin
    await fs.appendFile(app.getPath('userData') + '/MLM_GROUP/app.log', `${message}\n`);
}

async function uploadVideoFB(pathVideo, cookie, desc, proxy = null, link_page){

  console.log('pathVideo', pathVideo);

  let duration = await getVideoDuration(pathVideo);
  console.log('duration', duration);
    if(duration >= 90){
        console.log('video quá 90s');
        return {status: false, errno: 'Video dài quá 90s'};
    }
  console.log('desc', desc);
  console.log('proxy', proxy);
  console.log('link_page', link_page);
  puppeteer.use(StealthPlugin());
  puppeteer.use(AdblockerPlugin());
    
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: chromeFinder(),
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
    await logToConsoleAndFile(JSON.stringify(browser));
    await logToConsoleAndFile(chromeFinder());
     let page;
    if(Object.keys(proxy).length !== 0){
        const context = await browser.createIncognitoBrowserContext({ proxy: proxy.url });
        page = await context.newPage();
    }else{
        page = await browser.newPage();
    }
    await page.setViewport({ width: 1920, height: 1080 });
    
    if(proxy.user && proxy.password){
        await page.authenticate({proxy:user, password:password});
    }
    await page.setJavaScriptEnabled(true);
    // await page.setDefaultNavigationTimeout(0);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setCookie(...cookie);
    

    try{
        await page.goto(link_page, { waitUntil: 'networkidle2' });
        await page.goto('https://www.facebook.com/reels/create/?surface=ADDL_PROFILE_PLUS');
        await sleep(2000);
        let fileInputSelector = 'form > div > div > div:first-child > div > div:nth-child(2) > div > div:nth-child(2) > div > div input';
        await page.waitForSelector(fileInputSelector);
        const fileInput = await page.$$(fileInputSelector);
        console.log(fileInput);
        console.log('pathVideo', pathVideo);
        await fileInput[0].uploadFile(pathVideo);
        console.log('>>> load video in progress');

        await sleep(2000);
        let next_step = 'form > div > div > div:first-child > div > div:nth-child(3) > div:nth-child(2) > div';
        let next_step2 = 'form > div > div > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(2) > div';

        await page.click(next_step);
        await sleep(2000);
        let step2 = await page.$$(next_step2)
        console.log(step2);
        await step2[1].click();

        const desc_element = 'form > div > div > div:first-child > div > div:nth-child(2) > div:first-child > div:nth-child(2) > div > div > div > div > div:first-child > div:first-child > div:first-child > div';
        await page.waitForSelector(desc_element);

        await page.hover(desc_element);
        await page.focus(desc_element);
        await page.keyboard.type(desc );
        await sleep(2000);
        let next_step3= 'form > div > div > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(2) > div';
        await page.waitForSelector(next_step3);
        let step3 = await page.$$(next_step3);
        await step3[1].click();
        await page.waitForNavigation();
        console.log("Chuyển hướng");
        await sleep(3000);
        await browser.close();
        return {status: true};
        
        
    } catch (error) {
        console.log(error);
        await logToConsoleAndFile(JSON.stringify(error));
        await sleep(3000);
        await browser.close();
        return {status: false, errno: error};
    }

    
}

module.exports = { uploadVideoFB };