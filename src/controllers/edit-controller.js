/**
 * Returns editController.
 * @param {Object} args - {editComment}
 * @param {Function} args.editComment - editComment
 * @returns {editController} editComment
 */
function buildEditController(args) {
  const { editComment } = args;

  /**
   * Edits comment in the db with provided comment id.
   * @param {Object} args
   * @param {Object} args.httpRequest - httpRequest
   * @returns httpResponse
   */
  async function editController(args) {
    const { httpRequest } = args;
    let { id, ...changes } = httpRequest.body;
    if (!id) {
      id = httpRequest.params.id;
    }
    try {
      await editComment({ id, ...changes });
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: {},
      };
    } catch (e) {
      console.log(e);
      if (e instanceof TypeError) {
        return {
          headers: {
            'Content-Type': 'application/json',
          },
          statusCode: 400,
          body: {
            error: e.message,
          },
        };
      }
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 404,
        body: {
          error: e.message,
        },
      };
    }
  }

  return editController;
}

module.exports = buildEditController;
