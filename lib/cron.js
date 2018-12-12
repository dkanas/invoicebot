const CronJob = require('cron').CronJob

const createJob = onTick => new CronJob('*/10 * * * * *', onTick)

module.exports = createJob
