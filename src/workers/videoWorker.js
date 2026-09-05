require('dotenv').config();
const { Worker } = require('bullmq');
const { redisConnection } = require('../config/redis');
const { queueName } = require('../config/queue');
const { getJob, recordProgress, recordStatus } = require('../services/jobService');
const { processVideo } = require('../services/videoProcessor');
const { removeFile } = require('../utils/fileUtils');
const { logger } = require('../utils/logger');
const { closeMongoConnection } = require('../config/mongodb');

const worker = new Worker(queueName, async (queueJob) => {
  const appJob = await getJob(queueJob.data.jobId);
  if (!appJob) throw new Error(`Application job ${queueJob.data.jobId} was not found`);

  const attempts = queueJob.attemptsMade + 1;
  await recordStatus(appJob.id, 'processing', {
    attempts,
    startedAt: appJob.startedAt || new Date().toISOString(),
    progressUpdatedAt: new Date().toISOString(),
    error: null
  });
  try {
    await processVideo(queueJob.data, async (progress) => {
      await queueJob.updateProgress(progress);
      await recordProgress(appJob.id, progress);
    });
    await recordStatus(appJob.id, 'completed', {
      progress: 100, progressUpdatedAt: new Date().toISOString(), completedAt: new Date().toISOString()
    });
  } catch (error) {
    const willRetry = attempts < (queueJob.opts.attempts || 1);
    await recordStatus(appJob.id, willRetry ? 'retrying' : 'failed', {
      error: { message: error.message, stack: error.stack, at: new Date().toISOString() }
    });
    if (!willRetry) await removeFile(appJob.filePath);
    throw error;
  }
}, { connection: redisConnection, concurrency: 2 });

worker.on('completed', (job) => logger.info({ jobId: job.id }, 'Queue job completed'));
worker.on('failed', (job, error) => logger.error({ jobId: job?.id, err: error }, 'Queue job failed'));
worker.on('error', (error) => logger.error({ err: error }, 'Worker error'));

async function shutdown(signal) {
  logger.info({ signal }, 'Worker shutdown started');
  await Promise.all([worker.close(), closeMongoConnection()]);
  logger.info('Worker shutdown complete');
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
