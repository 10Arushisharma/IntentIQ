const { removeFile } = require('../utils/fileUtils');
const { logger } = require('../utils/logger');

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const stepDelay = Number(process.env.PROCESSING_STEP_DELAY_MS || 10000);

async function processVideo({ filePath, jobId }, updateProgress) {
  // Intentional simulation: replace these stages with FFmpeg commands when needed.
  for (const progress of [10, 25, 45, 70, 90, 100]) {
    await delay(stepDelay);
    await updateProgress(progress);
  }
  await removeFile(filePath);
  logger.info({ jobId }, 'Video processing simulation completed');
}

module.exports = { processVideo };
