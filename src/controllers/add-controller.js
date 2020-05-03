/**
 * Returns addController
 * @param {Object} args - { addComment }
 * @param {function} args.addComment - addComment
 * @returns {addController} - addController
 */
function buildAddController(args) {
  const { addComment } = args;
  /**
   * Adds comment to the db.
   * @param {Object} args
   * @param {Object} args.httpRequest - http request.
   * @returns httpResponse.
   */
  async function addController(args) {
    const { httpRequest } = args;
    const { source = {}, body, ...rest } = httpRequest;
    source.ip = httpRequest.ip;
    source.browser = httpRequest.headers['User-Agent'];
    if (httpRequest.headers['Referer']) {
      source.referer = httpRequest.headers['Referer'];
    }

    try {
      const comment = await addComment({
        commentInfo: { ...body, source },
      });
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(comment.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { comment },
      };
    } catch (e) {
      console.log(e);
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
  }

  return addController;
}

module.exports = buildAddController;
