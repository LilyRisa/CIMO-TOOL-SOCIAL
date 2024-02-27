const fs = require('fs').promises; 
const axios = require('axios');


async function checkLicense() {
  return true;
}


module.exports = { checkLicense };