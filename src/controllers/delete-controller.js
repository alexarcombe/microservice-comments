// const { removeComment } = require('../use-cases');

/**
 * Returns deleteController
 * @param {Object} args - {removeComment}
 * @param {Object} args.removeComment
 */
function buildDeleteController(args) {
  const { removeComment } = args;

  async function deleteController(args) {
    const { httpRequest } = args;
    let { id } = httpRequest.body;
    if (!id) {
      id = httpRequest.params.id;
    }

    const deleted = await removeComment({ id });
    return deleted
      ? {
          headers: {
            'Content-Type': 'application/json',
          },
          statusCode: 200,
          body: {},
        }
      : {
          headers: {
            'Content-Type': 'application/json',
          },
          statusCode: 404,
          body: { error: 'Comment not found.' },
        };
  }

  return deleteController;
}

module.exports = buildDeleteController;
