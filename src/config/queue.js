const { QueueEvents } = require('bullmq');
const { redisConnection } = require('./redis');

const queueName = 'video-processing';
const queueEvents = new QueueEvents(queueName, { connection: redisConnection });
queueEvents.on('error', (error) => console.error('Queue events error', error));

module.exports = { queueName, queueEvents };
