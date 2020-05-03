const makeComment = require('./index.js');
const makeFakeComment = require('../../__test__/comment');

test('Must have author.', () => {
  const fake = makeFakeComment({ author: null });
  expect(() => makeComment(fake)).toThrow('Comment must have an author.');
});

test('Author must be longer than 3 characters.', () => {
  const fake = makeFakeComment({ author: 'ale' });
  expect(() => makeComment(fake)).toThrow(
    "Author's name must be longer than 3 characters."
  );
});

test('Must have a source and be valid.', () => {
  let fake = makeFakeComment({ source: null });
  expect(() => makeComment(fake)).toThrow('Comment must have a source.');
  fake = makeFakeComment({
    source: { ip: undefined, browser: '', referrer: '' },
  });
  expect(() => makeComment(fake)).toThrow('Comment source must contain an IP.');
  fake = makeFakeComment({
    source: { ip: 'invalid', browser: '', referrer: '' },
  });
  expect(() => makeComment(fake)).toThrow(
    'Comment source must contain a valid IP.'
  );
});

test('Must have a postId.', () => {
  const fake = makeFakeComment({ postId: null });
  expect(() => makeComment(fake)).toThrow(
    'Comment must be connected to a postId.'
  );
});

test('Must have a text.', () => {
  let fake = makeFakeComment({ text: null });
  expect(() => makeComment(fake)).toThrow(
    'Comment text must least once character.'
  );
  fake = makeFakeComment({ text: '' });
  expect(() => makeComment(fake)).toThrow(
    'Comment text must least once character.'
  );
});

test('Must contain text after sanitizing.', () => {
  const okey = makeFakeComment({
    text: '<p>A text that is allowed but need closingtag',
  });
  const fail = makeFakeComment({
    text: '<script>This is not allowed.</script>',
  });
  const takeAwayScript = makeFakeComment({
    text: '<script>This is not allowed.</script><p>Okey</p>',
  });
  expect(makeComment(okey).text).toBe(
    '<p>A text that is allowed but need closingtag</p>'
  );
  expect(makeComment(takeAwayScript).text).toBe('<p>Okey</p>');
  expect(() => makeComment(fail)).toThrow(
    "Comment doesn't contain any usable text."
  );
});

test('Should be able to create a valid comment and getters should work.', () => {
  const valid = makeFakeComment();
  const comment = makeComment(valid);
  expect(comment.id).toBe(valid.id);
  expect(comment.author).toBe(valid.author);
  expect(comment.createdOn).toBe(valid.createdOn);
  expect(comment.modifiedOn).toBe(valid.modifiedOn);
  expect(comment.postId).toBe(valid.postId);
  expect(comment.replyToId).toBe(valid.replyToId);
  expect(comment.source).toEqual(valid.source);
  expect(comment.text).toBe(valid.text);
  expect(comment.published).toBe(valid.published);
  expect(comment.deleted).toBeFalsy();
  expect(comment.hashCode).toBe(valid.hash);
});

test('Should be able to create a new comment.', () => {
  const fake = makeFakeComment({
    id: undefined,
    createdOn: undefined,
    modifiedOn: undefined,
  });
  const comment = makeComment(fake);
  expect(comment.id).toBeDefined();
  expect(comment.createdOn).toBeDefined();
  expect(comment.modifiedOn).toBeDefined();
});

test('Should be able to publish and unpublish.', () => {
  const fake = makeFakeComment({ published: false });
  const comment = makeComment(fake);
  expect(comment.published).toBeFalsy();
  comment.publish();
  expect(comment.published).toBeTruthy();
  comment.unPublish();
  expect(comment.published).toBeFalsy();
});

test('Should be able to delete.', () => {
  const fake = makeFakeComment({ deleted: false });
  const comment = makeComment(fake);
  expect(comment.deleted).toBeFalsy();
  comment.setDeleted();
  expect(comment.deleted).toBeTruthy();
});

test('Hash should work.', () => {
  const fake = makeFakeComment({ deleted: false });
  const comment = makeComment(fake);
  expect(comment.hashCode).toBe(fake.hash);
});
