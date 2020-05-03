/**
 * Builds listComment, need to provide the comments db.
 * @param {Object} args
 * @param {Object} args.commentDb - Comments db.
 * @returns {listComments} listComments
 */
function buildListComments(args) {
  const { commentsDb } = args;

  /**
   * Returns the comments to a post.
   * @param {Object} args
   * @param {string} args.postId - The post id that the comments are related to.
   * @returns comments
   */
  async function listComments(args) {
    const { postId } = args;

    if (!postId) {
      throw new TypeError('Needs a post id to get the comments.');
    }

    let comments = await commentsDb.findByPostId({
      postId,
      ignoreRepliesTo: false,
    });

    if (comments.length === 0) {
      return comments;
    }

    return nest(comments);
  }

  function nest(comments) {
    let replies;
    return comments.reduce((acc, current) => {
      replies = comments.filter((comment) => comment.replyToId === current.id);
      if (replies.length > 0) {
        current.replies = replies;
      }
      if (!current.replyToId) {
        acc.push(current);
      }
      return acc;
    }, []);
  }

  return listComments;
}

module.exports = buildListComments;
