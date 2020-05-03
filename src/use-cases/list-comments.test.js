const buildListComments = require('./list-comments');
const makeFakeComment = require('../../__test__/comment');
const { commentsDb, closeDb, dropDb } = require('../db-calls/');

afterEach(async () => {
  await dropDb();
});
afterAll(async () => {
  await closeDb();
});

test('List comments.', async () => {
  const comment1 = makeFakeComment({ replyToId: null });
  const postId = comment1.postId;
  const comment2 = makeFakeComment({ replyToId: null, postId });
  const comment3 = makeFakeComment({ replyToId: null, postId });
  const reply1Comment1 = makeFakeComment({ replyToId: comment1.id, postId });
  const reply2Comment1 = makeFakeComment({ replyToId: comment1.id, postId });
  const reply1Comment3 = makeFakeComment({ replyToId: comment3.id, postId });
  const reply1reply1Comment1 = makeFakeComment({
    replyToId: reply1Comment1.id,
    postId,
  });
  const reply1reply2Comment1 = makeFakeComment({
    replyToId: reply2Comment1.id,
    postId,
  });
  const reply1reply1reply1Comment1 = makeFakeComment({
    replyToId: reply1reply1Comment1.id,
    postId,
  });

  const comments = [
    comment1,
    comment2,
    comment3,
    reply1Comment1,
    reply2Comment1,
    reply1Comment3,
    reply1reply1Comment1,
    reply1reply2Comment1,
    reply1reply1reply1Comment1,
  ];
  let x, comment, res;
  for (x = 0; x < comments.length; x++) {
    comment = comments[x];
    res = await commentsDb.insert({ comment });
  }

  comment1.replies = [reply1Comment1, reply2Comment1];
  comment3.replies = [reply1Comment3];
  reply1Comment1.replies = [reply1reply1Comment1];
  reply2Comment1.replies = [reply1reply2Comment1];
  reply1reply1Comment1.replies = [reply1reply1reply1Comment1];
  const expected = [comment1, comment2, comment3];
  const listComments = buildListComments({ commentsDb });
  const commentList = await listComments({
    postId,
  });
  expect(commentList).toEqual(expect.arrayContaining(expected));
});

test('Without post id.', async () => {
  const listComments = buildListComments({ commentsDb });
  await expect(listComments({})).rejects.toThrow(
    'Needs a post id to get the comments.'
  );
});

test('No comments.', async () => {
  const listComments = buildListComments({ commentsDb });
  const res = await listComments({ postId: '1337' });
  expect(res).toEqual([]);
});
