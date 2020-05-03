const makeComment = require('../comment');

/**
 * Builds addComment function.
 * @param {Object} args - {db}
 * @param {Object} args.db - Db handler
 * @returns {addComment} addComment
 */
function buildAddComment(args) {
  const { commentsDb } = args;

  /**
   * Builds a comment and add it to the db.
   * @param {Object} args - {commentInfo}
   * @param {Object} args.commentInfo - Comment info.
   * @returns comment
   */
  async function addComment(args) {
    const { commentInfo } = args;
    const comment = makeComment(commentInfo);
    const exists = await commentsDb.findByHash({ hash: comment.hashCode });

    if (exists) {
      return exists;
    }

    const source = comment.source;
    return await commentsDb.insert({
      comment: {
        id: comment.id,
        author: comment.author,
        createdOn: comment.createdOn,
        modifiedOn: comment.modifiedOn,
        postId: comment.postId,
        replyToId: comment.replyToId,
        text: comment.text,
        published: comment.published,
        hash: comment.hashCode,
        source: {
          ip: source.ip,
          browser: source.browser,
          referrer: source.referrer,
        },
      },
    });
  }

  return addComment;
}

module.exports = buildAddComment;
