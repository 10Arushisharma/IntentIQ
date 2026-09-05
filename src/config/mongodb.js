const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
let database;

async function getDatabase() {
  if (!database) {
    await client.connect();
    database = client.db(process.env.MONGODB_DATABASE || 'video_processing');
    await database.collection('jobs').createIndex({ id: 1 }, { unique: true });
    await database.collection('jobs').createIndex({ createdAt: -1 });
  }
  return database;
}

async function closeMongoConnection() {
  await client.close();
  database = undefined;
}

module.exports = { getDatabase, closeMongoConnection };
