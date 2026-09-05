const { v4: uuid } = require('uuid');
const jobStore = require('../models/jobStore');

async function createJob(file) {
  const now = new Date().toISOString();
  return jobStore.create({
    id: uuid(), status: 'pending', progress: 0, attempts: 0,
    originalName: file.originalname, mimeType: file.mimetype, size: file.size,
    filePath: file.path, error: null, createdAt: now, updatedAt: now, progressUpdatedAt: now,
    progressHistory: [{ progress: 0, at: now }],
    statusHistory: [{ status: 'pending', at: now }],
    startedAt: null, completedAt: null
  });
}

async function getJob(id) { return jobStore.findById(id); }
async function listJobs() { return jobStore.findAll(); }
async function updateJob(id, patch) { return jobStore.update(id, patch); }
async function recordProgress(id, progress) { return jobStore.recordProgress(id, progress); }
async function recordStatus(id, status, patch) { return jobStore.recordStatus(id, status, patch); }
function publicJob(job) {
  if (!job) return null;
  const { filePath, ...safeJob } = job;
  return safeJob;
}

module.exports = { createJob, getJob, listJobs, updateJob, recordProgress, recordStatus, publicJob };
