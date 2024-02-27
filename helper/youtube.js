
const puppeteer = require('puppeteer-extra');
const path = require('path');   
var fs = require('fs').promises;
const {extractHashtags} = require('./ultils');
const { log } = require('console');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const {getVideoDuration} = require('./video')

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function getChromiumExecPath() {
    return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}

async function uploadVideoYT(pathVideo, cookie, desc, title, proxy = null, link_page){

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
              headless: true,
              executablePath: getChromiumExecPath(),
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
      
              //title
              let title_elecment = '.title #container-content';
              await page.waitForSelector(title_elecment);
              await sleep(2000);
              await page.hover(title_elecment);
              await page.focus(title_elecment);
      
              await page.keyboard.down('Control');
              await page.keyboard.press('A');
              await page.keyboard.up('Control');
              console.log("delete");
              await sleep(1000);
              // Nhấn nút Delete
              await page.keyboard.press('Delete');
              await page.keyboard.type(title);
              await sleep(2000);
      
              // desc
              let desc_elecment = '.description #description-container';
              await page.waitForSelector(desc_elecment);
              const desc_q = await page.$$(desc_elecment);
              await desc_q[0].click();
              await sleep(2000);
              await page.hover(desc_elecment);
              await page.focus(desc_elecment);
      
              await page.keyboard.down('Control');
              await page.keyboard.press('A');
              await page.keyboard.up('Control');
              console.log("delete");
              await sleep(1000);
              // Nhấn nút Delete
              await page.keyboard.press('Delete');
              await page.keyboard.type(desc);
              await sleep(2000);
      
              let child = 'tp-yt-paper-radio-button[name=VIDEO_MADE_FOR_KIDS_NOT_MFK] #radioContainer';
              await page.waitForSelector(child);
              const child_q = await page.$$(desc_elecment);
              await child_q[0].click();
      
              // kiểm tra hidden
              let next_step = '.ytcp-uploads-dialog > #next-button';
              await page.waitForSelector(next_step);
              const isHidden = await page.evaluate((next_step) => {
                  const div = document.querySelector(next_step);
                  return div ? div.hasAttribute('hidden') : false;
                }, next_step);
      
              if(isHidden){
                  console.log('quá hạn ngạch');
                  await browser.close();
                  return {status: false, errno: 'exceed daily quota'};
              }
      
              const next_q = await page.$$(next_step);
              await next_q[0].click();
              await sleep(1000);
              await next_q[0].click();
              await sleep(1000);
              await next_q[0].click();
              await sleep(1000);
              let done_step = '.ytcp-uploads-dialog > #done-button';
              const done_q = await page.$$(done_step);
              console.log('click done');
              console.log(done_q);
              await done_q[0].click();
      
              let done_share = '.ytcp-uploads-still-processing-dialog';
              await page.waitForSelector(done_share);
              await sleep(25000);
              await browser.close();
              return {status: true};
              
              
          } catch (error) {
              console.log(error);
              await browser.close();
              return {status: false, errno: error};
          }
      
          
      }

module.exports = { uploadVideoYT };