
const puppeteer = require('puppeteer-extra');
const path = require('path');   
var fs = require('fs').promises;
const {extractHashtags} = require('./ultils');
const { log } = require('console');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const {getVideoDuration} = require('./video')

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function uploadVideoFB(pathVideo, cookie, desc, title, proxy = null, link_page){

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
        args: [
            '--no-sandbox',
            // '--disable-setuid-sandbox',
            // '--disable-dev-shm-usage',
            // '--disable-accelerated-2d-canvas',
            // '--no-first-run',
            // '--disable-gpu',
            // // '--single-process',
            // '--no-zygote',
            // '--ignore-certificate-errors',
            // '--disable-background-networking',
            // '--disable-background-timer-throttling',
            // '--disable-client-side-phishing-detection',
            // '--disable-default-apps',
            // // '--disable-extensions',
            // '--disable-hang-monitor',
            // '--disable-popup-blocking',
            // '--disable-prompt-on-repost',
            // '--disable-sync',
            // '--disable-translate',
            // '--metrics-recording-only',
            // '--safebrowsing-disable-auto-update',
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
    await page.setJavaScriptEnabled(true);
    // await page.setDefaultNavigationTimeout(0);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');
    await page.setCookie(...cookie);
    

    try{
        let channel_id = get_channel_id(link_page);
        if(channel_id == null) return {status : false};

        let link_upload = "https://studio.youtube.com/channel/"+channel_id+"/videos/upload?d=ud&filter=%5B%5D&sort=%7B%22columnType%22%3A%22date%22%2C%22sortOrder%22%3A%22DESCENDING%22%7D"
        await page.goto(link_upload);
        await sleep(2000);
        let fileInputSelector = '#select-files-button';
        await page.waitForSelector(fileInputSelector);
        const fileInput = await page.$$("input[name=Filedata]");
        console.log(fileInput);
        console.log('pathVideo', pathVideo);
        await fileInput[0].uploadFile(pathVideo);
        console.log('>>> load video in progress');
        await sleep(2000);

        // let next_step = 'form > div > div > div:first-child > div > div:nth-child(3) > div:nth-child(2) > div';
        // let next_step2 = 'form > div > div > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(2) > div';

        // await page.click(next_step);
        // await sleep(2000);
        // let step2 = await page.$$(next_step2)
        // console.log(step2);
        // await step2[1].click();

        // const desc_element = 'form > div > div > div:first-child > div > div:nth-child(2) > div:first-child > div:nth-child(2) > div > div > div > div > div:first-child > div:first-child > div:first-child > div';
        // await page.waitForSelector(desc_element);

        // await page.hover(desc_element);
        // await page.focus(desc_element);
        // await page.keyboard.type(desc );
        // await sleep(2000);
        // let next_step3= 'form > div > div > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(2) > div';
        // await page.waitForSelector(next_step3);
        // let step3 = await page.$$(next_step3);
        // await step3[1].click();
        // await sleep(3000);
        // await browser.close();
        // return {status: true};
        
        
        
    } catch (error) {
        console.log(error);
        await browser.close();
        return {status: false, errno: error};
    }

    
}

function get_channel_id(link){
    const regex = /\/channel\/([a-zA-Z0-9_-]+)/;
    const match = regex.exec(link);
    const channelId = match ? match[1] : null;
    return channelId;
}


 const main = async()=>{
    let file = await fs.readFile('C:\\Users\\minhm\\AppData\\Roaming\\tool-mlm/MLM_GROUP/yt_background.json');
    file = JSON.parse(file)
    cookie = JSON.parse(file.cookie);
    console.log(cookie[1]);
    
    await uploadVideoFB('C:\\Users\\minhm\\Desktop\\video test\\save\\sss.mp4', cookie, 'test asjkdhksajd',"title test 1", {}, 'https://www.youtube.com/channel/UCb0RH3tq-ltNnTDyODI_Inw');
}
main();
