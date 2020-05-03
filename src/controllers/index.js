const buildAddController = require('./add-controller');
const buildEditController = require('./edit-controller');
const buildGetController = require('./get-controller');
const buildDeleteController = require('./delete-controller');
const {
  addComment,
  editComment,
  listComments,
  removeComment,
} = require('../use-cases');

const addController = buildAddController({ addComment });
const editController = buildEditController({ editComment });
const getController = buildGetController({ listComments });
const deleteController = buildDeleteController({ removeComment });

const commentControllers = Object.freeze({
  addController,
  editController,
  getController,
  deleteController,
});

module.exports = commentControllers;
