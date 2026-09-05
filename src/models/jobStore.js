const { getDatabase } = require('../config/mongodb');

async function create(job) {
  const database = await getDatabase();
  await database.collection('jobs').insertOne(job);
  return job;
}
async function findById(id) {
  const database = await getDatabase();
  return database.collection('jobs').findOne({ id }, { projection: { _id: 0 } });
}
async function findAll() {
  const database = await getDatabase();
  return database.collection('jobs').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
}
async function update(id, patch) {
  const database = await getDatabase();
  const result = await database.collection('jobs').findOneAndUpdate(
    { id },
    { $set: { ...patch, updatedAt: new Date().toISOString() } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  return result || null;
}

async function recordProgress(id, progress) {
  const database = await getDatabase();
  const at = new Date().toISOString();
  return database.collection('jobs').findOneAndUpdate(
    { id },
    {
      $set: { progress, progressUpdatedAt: at, updatedAt: at },
      $push: { progressHistory: { progress, at } }
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
}

async function recordStatus(id, status, patch = {}) {
  const database = await getDatabase();
  const at = new Date().toISOString();
  return database.collection('jobs').findOneAndUpdate(
    { id },
    {
      $set: { ...patch, status, updatedAt: at },
      $push: { statusHistory: { status, at } }
    },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
}

module.exports = { create, findById, findAll, update, recordProgress, recordStatus };
