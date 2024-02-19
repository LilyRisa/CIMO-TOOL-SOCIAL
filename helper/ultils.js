const fs = require('fs').promises; 
const path = require('path');
// const path = require('path');
const {checkLicense} = require('./license');
const { app } = require('electron');
const readline = require('readline');

function extractHashtags(desc) {
    // Biểu thức chính quy để tìm các hashtag
    const hashtagRegex = /#\w+/g;
  
    // Tìm tất cả các hashtag trong văn bản
    const hashtags = desc.match(hashtagRegex) || [];
  
    // Loại bỏ các hashtag khỏi văn bản
    const text = desc.replace(hashtagRegex, '').trim();
  
    return {
      text,
      hashtags
    };
  }

  function isValidCronExpression(text) {
    try {
      // Attempt to create a CronExpression object
      cronParser.parseExpression(text);
      return true; // If successful, it's a valid cron expression
    } catch (error) {
      return false; // If an error occurs, it's not a valid cron expression
    }
  }
  const checkFileExistence = async (filePath) => {
    try{
      await fs.access(filePath, fs.constants.F_OK);
      return true;
    }catch (err) {
      return false;
    }

  }

  async function createFile(filePath, fileContent) {
    try {
      // Tách đường dẫn để lấy thư mục cha
      const dir = path.dirname(filePath);
  
      // Tạo thư mục nếu nó không tồn tại
      await fs.mkdir(dir, { recursive: true });
  
      // Tạo tệp tin và ghi nội dung vào nó
      await fs.writeFile(filePath, fileContent, 'utf-8');
  
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }


async function getCronTikTok(){

  if(checkLicense()){
      let arrFile = await fs.readdir(app.getPath('userData') + '/MLM_GROUP');
      const regex = /^tikok_background.*\.json$/;
      const filteredFiles = arrFile.filter((file) => regex.test(file));
      return filteredFiles.map(file => app.getPath('userData') + '/MLM_GROUP/'+ file);
  }
  if(checkFileExistence(app.getPath('userData') + '/MLM_GROUP/tikok_background.json')) return app.getPath('userData') + '/MLM_GROUP/tikok_background.json';
  return [];

}

function getRandomText(text) {
  const lines = text.split('\n');

    // Lọc bỏ các dòng trống (nếu có)
    const nonEmptyLines = lines.filter(line => line.trim() !== '');

    // Lựa chọn ngẫu nhiên một dòng từ danh sách
    const randomIndex = Math.floor(Math.random() * nonEmptyLines.length);
    const randomText = nonEmptyLines[randomIndex];

    return randomText;
}

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

module.exports = { extractHashtags, isValidCronExpression, checkFileExistence, createFile, getCronTikTok, getRandomText, getRandomElement };