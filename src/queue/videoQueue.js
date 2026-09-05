const { Queue } = require('bullmq');
const { redisConnection } = require('../config/redis');
const { queueName } = require('../config/queue');

const videoQueue = new Queue(queueName, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { age: 86400, count: 1000 },
    removeOnFail: { age: 604800 }
  }
});

function enqueueVideo(job) {
  return videoQueue.add('process-video', { jobId: job.id, filePath: job.filePath }, { jobId: job.id });
}

module.exports = { videoQueue, enqueueVideo };
