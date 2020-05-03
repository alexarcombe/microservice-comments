const { v4 } = require('uuid');

const Id = Object.freeze({
  makeId: v4,
});

module.exports = Id;
