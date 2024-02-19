const puppeteer = require('puppeteer-extra');
const path = require('path');   
var fs = require('fs').promises;
const {extractHashtags} = require('./ultils');
const { log } = require('console');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function uploadVideoFB(pathVideo, cookie, desc, proxy = null, link_page){

  console.log('pathVideo', pathVideo);
//   console.log('cookie', cookie);
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
        await page.goto(link_page);
        await page.goto('https://www.facebook.com/reels/create/?surface=ADDL_PROFILE_PLUS');
        await sleep(2000);
        try {
            let fileInputSelector = 'input[type=file]';
            const fileInput = await page.$(fileInputSelector);
            await fileInput.uploadFile(pathVideo);
            console.log('>>> load video in progress');
        } catch (error) {
            console.log('error: ', error);

            // xử lý đoạn này
        }
        await sleep(2000);
        let next_step = 'form > div > div > div:first-child > div > div:nth-child(3) > div:nth-child(2) > div';
        let next_step2 = 'form > div > div > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(2) > div';

        await page.click(next_step);
        await sleep(2000);
        let step2 = await page.$$(next_step2)
        console.log(step2);
        await step2[1].click();
        
        // await page.click(next_step2);
       
        // let click_next_step = await page.$(fileInputSelector);
        // click_next_step.click();
        // await elements[0].click() ;
        // await page.waitForXPath('/html/body/div[2]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div[4]/div[2]/div/div[2]/div[1]/div/div/div/div/div[2]/div[3]');

        // let reel_element = await page.$x('/html/body/div[2]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div[4]/div[2]/div/div[2]/div[1]/div/div/div/div/div[2]/div[3]');
        // await reel_element[0].click();
        // await page.waitForXPath('/html/body/div[2]/div/div[1]/div/div[5]/div/div/div[3]/form/div/div/div[1]/div/div[3]/div[1]/div[2]/div/div/div[1]/div/input');
        // reel_element = await page.$x('/html/body/div[2]/div/div[1]/div/div[5]/div/div/div[3]/form/div/div/div[1]/div/div[3]/div[1]/div[2]/div/div/div[1]/div/input');
        // await page.uploadFile(pathVideo);




        // const uploadButton = '#mount_0_0_v0 > div > div:nth-child(1) > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x9f619.x2lah0s.x1nhvcw1.x1qjc9v5.xozqiw3.x1q0g3np.x78zum5.x1iyjqo2.x1t2pt76.x1n2onr6.x1ja2u2z.x1h6rjhl > div.x9f619.x1n2onr6.x78zum5.xdt5ytf.x193iq5w.xeuugli.x2lah0s.x1t2pt76.x1xzczws.x1cvmir6.x1vjfegm > div > div.xb57i2i.x1q594ok.x5lxg6s.x78zum5.xdt5ytf.x6ikm8r.x1ja2u2z.x1pq812k.x1rohswg.xfk6m8.x1yqm8si.xjx87ck.x1l7klhg.x1iyjqo2.xs83m0k.x2lwn1j.xx8ngbg.xwo3gff.x1oyok0e.x1odjw0f.x1e4zzel.x1n2onr6.xq1qtft > div.x78zum5.xdt5ytf.x1iyjqo2.x1n2onr6 > div.x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x2lah0s.x193iq5w > div > div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1l90r2v.xexx8yu > div > div > div > div > div > div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1swvt13.x1pi30zi.xyamay9.x1l90r2v > div > div';
        // await page.waitForSelector(uploadButton);
        // await page.click(uploadButton);

        
        
    } catch (error) {
        console.log(error);
        await browser.close();
        return false;
    }

    
}

 const main = async()=>{
    let file = await fs.readFile('C:\\Users\\minhm\\AppData\\Roaming\\tool-mlm/MLM_GROUP/fb_background.json');
    file = JSON.parse(file)
    cookie = JSON.parse(file.cookie);
    console.log(cookie[1]);
    
    await uploadVideoFB('C:\\Users\\minhm\\Desktop\\video test\\video\\sss.mp4', cookie, 'test asjkdhksajd', {}, 'https://www.facebook.com/profile.php?id=61551738353772');
}
main();
