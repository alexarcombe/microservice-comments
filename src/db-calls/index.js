const { MongoClient } = require('mongodb');
const buildCommentsDB = require('./comments-db');
const { mongoURL, dbName, collection } = require('../../config/db');

const client = new MongoClient(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function makeDb() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

async function closeDb() {
  if (client.isConnected()) {
    await client.close();
  }
}

async function dropDb() {
  if (client.isConnected()) {
    return await client
      .db(dbName)
      .collection(collection)
      .deleteMany({});
  }
  return false;
}

const commentsDb = buildCommentsDB({ makeDb, collection });

module.exports = { makeDb, closeDb, dropDb, commentsDb };
