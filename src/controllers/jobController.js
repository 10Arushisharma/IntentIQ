const { getJob, listJobs, publicJob } = require('../services/jobService');

function sendFresh(res, payload) {
  return res.set('Cache-Control', 'no-store, max-age=0').json(payload);
}

async function list(req, res, next) { try { return sendFresh(res, (await listJobs()).map(publicJob)); } catch (error) { return next(error); } }
async function getById(req, res, next) {
  let job;
  try { job = await getJob(req.params.id); } catch (error) { return next(error); }
  if (!job) return res.status(404).json({ error: 'Job not found' });
  return sendFresh(res, publicJob(job));
}

module.exports = { list, getById };
