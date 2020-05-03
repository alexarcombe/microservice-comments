const makeFakeComment = require('../../__test__/comment');
const buildAddComment = require('./add-comment');
const { commentsDb, closeDb, dropDb } = require('../db-calls/');

afterEach(async () => {
  await dropDb();
});

afterAll(async () => {
  await closeDb();
});

test('Add comment.', async () => {
  const comment = makeFakeComment({ id: null });
  const addComment = buildAddComment({ commentsDb });
  const result1 = await addComment({ commentInfo: comment });
  const result2 = await addComment({ commentInfo: comment }); // should return already existing comment.
  comment.id = result1.id;
  expect(result1).toEqual(comment);
  expect(result2).toEqual(result1);
});
