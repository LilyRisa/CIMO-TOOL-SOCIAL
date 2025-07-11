const puppeteer = require('puppeteer-extra');
const path = require('path');   
var fs = require('fs');
const {extractHashtags} = require('../helper/ultils');
const { log } = require('console');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const chromeFinder = require('chrome-finder');
const { app} = require('electron');

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function logToConsoleAndFile(message) {
  console.log(message);
  // Ghi log vào tệp tin
  await fs.appendFile(app.getPath('userData') + '/MLM_GROUP/app.log', `${message}\n`);
}

async function uploadVideo(pathVideo, cookie, desc, proxy = null){
  puppeteer.use(StealthPlugin())
    
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
    
    
    if(proxy.user && proxy.password){
        await page.authenticate({proxy:user, password:password});
    }
    
    page.setDefaultNavigationTimeout(0);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');
    await page.setCookie(...cookie);

    try{
        await page.goto('https://www.tiktok.com/');
        const uploadButton = '[data-e2e=upload-icon]';
        await page.waitForSelector(uploadButton);
        await page.goto('https://www.tiktok.com/creator-center/upload?from=upload');
        // await page.waitForNavigation({ waitUntil: 'load' })
        const iframeSelector = '[data-tt="Upload_index_iframe"]';
        const iframeElement = await page.waitForSelector(iframeSelector);
        const frame = await iframeElement.contentFrame();

        const elementInsideIframeSelector = '.upload-container';
        await frame.waitForSelector(elementInsideIframeSelector);
        try {
            fileInputSelector = 'input[type=file]';
            const fileInput = await frame.$(fileInputSelector);
            await fileInput.uploadFile(pathVideo);
            console.log('>>> load video in progress');
        } catch (error) {
            console.log('error: ', error);
            await sleep(1000);
            await uploadVideo(page, pathVideo);
        }

        const {text, hashtags} = extractHashtags(desc);
        await typeHead(page, frame, text);
        await typeHashTag(page, frame, hashtags);
        // await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        let check = await sendPost(page, frame, 1);
        console.log('main check: ', check);
        if(check){
            await sleep(3000);
            await browser.close();
            return true;
        }
        await sleep(3000);
        await browser.close();
        return false;
    } catch (error) {
      await logToConsoleAndFile(JSON.stringify(error));
        console.log(error);
        await browser.close();
        return false;
    }

    
}

const sendPost = async (windows, frame, tryCount = 1) => {

    try {
        const nameInputSelector = '.btn-post > button:not([disabled])';
        await frame.waitForSelector(nameInputSelector);
        console.log('>>> load video success');
        console.log('>>> try send post: ', tryCount);
        let send = await frame.$(nameInputSelector);
        await frame.$eval(nameInputSelector, (btn) => btn.click());
        await frame.waitForSelector('.TUXModal-backdrop');
        return true;
    } catch (error) {
      await logToConsoleAndFile(JSON.stringify(error));
      console.log('error: ', error);
      if (tryCount === 4) {
        console.log('>>> skip profile');
        return false;
      }
      await sleep(1000);
      tryCount += 1;
      await sendPost(windows, frame, tryCount);
    }
};

const typeHead = async (windows, page, head) => {
    try {
      console.log('>>> try type head');
      const nameInputSelector = '.public-DraftEditor-content';
      await page.waitForSelector(nameInputSelector);
      await page.hover(nameInputSelector);
      await page.focus(nameInputSelector);
      
        // Nhấn tổ hợp phím Ctrl+A (chọn toàn bộ)
        await windows.keyboard.down('Control');
        await windows.keyboard.press('A');
        await windows.keyboard.up('Control');

        // Nhấn nút Delete
        await windows.keyboard.press('Delete');

        await windows.keyboard.type(`${head} `);
      console.log('>>> head success');
    } catch (error) {
      await logToConsoleAndFile(JSON.stringify(error));
      console.log('error: ', error);
      await sleep(2000);
      await typeHead(page, head);
    }
  };

const typeHashTag = async (windows, page, tags) => {
    try {
      console.log('>>> try type hashtags');
      const nameInputSelector = '.public-DraftEditor-content';
      await page.waitForSelector(nameInputSelector);
      await page.hover(nameInputSelector);
      await page.focus(nameInputSelector);
      for (const hashtag of tags) {
        await windows.keyboard.type(hashtag);
        await sleep(2500);
        await windows.keyboard.press('Enter');
      }
      console.log(`>>> hashtags success`);
    } catch (error) {
      await logToConsoleAndFile(JSON.stringify(error));
      console.log('error: ', error);
      await sleep(2000);
      await typeHashTag(page, tags);
    }
  };

// async function exce(){
//     // const data = await fs.readFile('./video.js', { encoding: 'utf8' });
//     fs.readFile('cookie_tiktok.json', async (err, data) => {
//         cookiesString = JSON.parse(data);
//         await uploadVideo('C:\\Users\\minhm\\Downloads\\fb.mp4', cookiesString, 'đây là demo test #vietnam #hehe');
//      })
//     // const cookiesString = await fs.readFile('cookie_tiktok.json', 'utf8');
//     // cookiesString = JSON.parse(data);

//     // 
// }

module.exports = { uploadVideo };