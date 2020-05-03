const buildEditComment = require('./edit-comment');
const { commentsDb, closeDb, dropDb } = require('../db-calls/');
const makeFakeComment = require('../../__test__/comment');

afterEach(async () => {
  await dropDb();
});

afterAll(async () => {
  await closeDb();
});

test('Edit a comment.', async () => {
  const comment = makeFakeComment();
  await commentsDb.insert({ comment });

  const editComment = buildEditComment({ commentsDb });

  const editResult = await editComment({
    id: comment.id,
    test: 'I want this to be the text',
  });
  expect(editResult).toBeTruthy();
});

test('Edit with no id.', async () => {
  const editComment = buildEditComment({ commentsDb });
  await expect(editComment({ test: 'I want this' })).rejects.toThrow(
    'Needs a comment id.'
  );
});

test('Edit comment not in DB', async () => {
  const editComment = buildEditComment({ commentsDb });
  await expect(editComment({ id: '1', test: 'I want this' })).rejects.toThrow(
    'Comment not found.'
  );
});
