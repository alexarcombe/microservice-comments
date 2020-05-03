const ipRegex = require('ip-regex');
const sanitizeHtml = require('sanitize-html');
const buildMakeComment = require('./comment');
const buildMakeSource = require('./source');
const Id = require('../Id');

function isValidIp(ip) {
  return ipRegex({ exact: true }).test(ip);
}

function hash(text) {
  const prime = 31;
  let hash = 0;
  let c;
  for (c in text) {
    hash = hash * prime + text.charCodeAt(c);
  }
  return hash;
}

function sanitize(text) {
  return sanitizeHtml(text);
}

const makeSource = buildMakeSource({ isValidIp });
const makeComment = buildMakeComment({ Id, hash, sanitize, makeSource });

module.exports = makeComment;
