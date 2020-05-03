const buildAddComment = require('./add-comment.js');
const buildEditComment = require('./edit-comment.js');
const buildListComment = require('./list-comments.js');
const buildRemoveComment = require('./remove-comment.js');
const { commentsDb } = require('../db-calls');

const addComment = buildAddComment({ commentsDb });
const editComment = buildEditComment({ commentsDb });
const listComments = buildListComment({ commentsDb });
const removeComment = buildRemoveComment({ commentsDb });

module.exports = { addComment, editComment, listComments, removeComment };
