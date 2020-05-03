const makeFakeComment = require('../../__test__/comment');
const { commentsDb, closeDb, dropDb } = require('./index');
const { exportAllDeclaration } = require('babel-types');

afterEach(async () => {
  await dropDb();
});

afterAll(async () => {
  await closeDb();
});

test('Insert a comment.', async () => {
  const comment = makeFakeComment();
  const result = await commentsDb.insert({ comment });
  expect(result).toEqual(comment);
});

test('Find all.', async () => {
  const input = [makeFakeComment(), makeFakeComment(), makeFakeComment()];
  await Promise.all([
    commentsDb.insert({ comment: input[0] }),
    commentsDb.insert({ comment: input[1] }),
    commentsDb.insert({ comment: input[2] }),
  ]);
  const result = await commentsDb.findAll({});
  expect(result).toEqual(expect.arrayContaining(input));
});

describe('Find one', () => {
  let comment;

  beforeEach(async () => {
    comment = makeFakeComment({ replyToId: null });
    await commentsDb.insert({ comment });
  });

  it('Find by id.', async () => {
    const res = await commentsDb.findById({ id: comment.id });
    expect(res).toEqual(comment);
  });

  it('Find by hash.', async () => {
    const res = await commentsDb.findByHash({ hash: comment.hash });
    expect(res).toEqual(comment);
  });

  it('Find by post id', async () => {
    const res = await commentsDb.findByPostId({ postId: comment.postId });
    expect(res).toContainEqual(comment);
  });
});

test('Find replies.', async () => {
  const comment = makeFakeComment();
  const replies = [
    makeFakeComment({ replyToId: comment.id }),
    makeFakeComment({ replyToId: comment.id }),
    makeFakeComment({ replyToId: comment.id }),
  ];

  await Promise.all(
    replies.map((reply) => commentsDb.insert({ comment: reply }))
  );
  const res = await commentsDb.findReplies({ commentId: comment.id });
  expect(res).toEqual(expect.arrayContaining(replies));
});

test('Update comment.', async () => {
  const comment = makeFakeComment();
  const updated = makeFakeComment({ id: comment.id });
  await commentsDb.insert({ comment });
  const update = await commentsDb.update({ comment: updated });
  expect(update).toBeTruthy();
  const res = await commentsDb.findById({ id: comment.id });
  expect(res).toEqual(updated);
});

test('Remove comment.', async () => {
  const comment = makeFakeComment();
  await commentsDb.insert({ comment });
  const removed = await commentsDb.remove({ id: comment.id });
  expect(removed).toBeTruthy();
  const res = await commentsDb.findAll();
  expect(res).toEqual([]);
});
