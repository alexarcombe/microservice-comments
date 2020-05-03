/**
 * Returns getController
 * @param {Object} args - {listComments}
 * @param {Object} args.listComments - listComments
 * @returns {getController}
 */
function buildGetController(args) {
  const { listComments } = args;

  /**
   *
   * @param {Object} args
   * @param {Object} args.httpRequest - Http request.
   * @returns [comments]
   */
  async function getController(args) {
    const { httpRequest } = args;
    const { postId } = httpRequest.query;
    try {
      const comments = await listComments({ postId });
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: { comments },
      };
    } catch (e) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: { error: e.message },
      };
    }
  }

  return getController;
}

module.exports = buildGetController;
