const { createJob, updateJob, publicJob } = require('../services/jobService');
const { enqueueVideo } = require('../queue/videoQueue');
const { removeFile } = require('../utils/fileUtils');

async function uploadVideo(req, res, next) {
  if (!req.file) return res.status(400).json({ error: 'A video file is required in the "video" field' });
  const job = await createJob(req.file);
  try {
    await enqueueVideo(job);
    return res.status(202).json({
      jobId: job.id,
      status: job.status,
      jobUrl: `${req.protocol}://${req.get('host')}/api/jobs/${job.id}`
    });
  } catch (error) {
    await updateJob(job.id, { status: 'failed', error: { message: error.message, stack: error.stack, at: new Date().toISOString() } });
    await removeFile(req.file.path);
    return next(error);
  }
}

module.exports = { uploadVideo };
