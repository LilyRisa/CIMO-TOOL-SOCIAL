const fs = require('fs').promises; 
const { log } = require('console');
const schedule = require('node-schedule');

function getCronProgress() {
    const {scheduledJobs} = schedule;
    console.log(scheduledJobs);
    return scheduledJobs;
    // 
}


  
  
  module.exports = { getCronProgress };