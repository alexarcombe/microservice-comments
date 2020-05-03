const makeFakeComment = require('../../__test__/comment');
const { commentsDb, closeDb, dropDb } = require('../db-calls/');
const buildRemoveComment = require('./remove-comment');

afterAll(async () => {
  await dropDb();
  await closeDb();
});

test('Remove comment.', async () => {
  const remove = makeFakeComment();
  const other = makeFakeComment();
  await commentsDb.insert({ comment: remove });
  await commentsDb.insert({ comment: other });
  const removeComment = buildRemoveComment({ commentsDb });
  const res = await removeComment({ id: remove.id });
  expect(res).toBeTruthy();
  const comments = await commentsDb.findAll();
  expect(comments).toEqual([other]);
});
