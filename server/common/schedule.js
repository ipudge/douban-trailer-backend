const schedule = require('node-schedule');

function scheduleJob(cronstyle, fn){
  schedule.scheduleJob(cronstyle,fn);
}

module.exports = scheduleJob;
