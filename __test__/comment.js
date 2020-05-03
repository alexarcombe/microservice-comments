const faker = require('faker');
const { v4 } = require('uuid');

const Id = Object.freeze({
  makeId: v4,
});

function hash(text) {
  const prime = 31;
  let hash = 0;
  let c;
  for (c in text) {
    hash = hash * prime + text.charCodeAt(c);
  }
  return hash;
}

function makeFakeComment(overrides) {
  const comment = {
    author: faker.name.findName(),
    createdOn: Date.now(),
    id: Id.makeId(),
    modifiedOn: Date.now(),
    postId: Id.makeId(),
    published: true,
    replyToId: Id.makeId(),
    text: faker.lorem.paragraph(3),
    source: {
      ip: faker.internet.ip(),
      browser: faker.internet.userAgent(),
      referrer: faker.internet.url(),
    },
  };
  comment.hash = hash(
    comment.text.substring(0, 5) + comment.author.substring(0, 5)
  );

  return {
    ...comment,
    ...overrides,
  };
}

module.exports = makeFakeComment;
