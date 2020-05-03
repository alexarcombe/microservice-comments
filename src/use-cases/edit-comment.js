const makeComment = require('../comment/');

/**
 * Builds edit comment.
 * @param {Object} args {commentsDb}
 * @param {Object} args.commentsDb - Comments db.
 * @returns {editComment} editComment
 */
function buildEditComment(args) {
  const { commentsDb } = args;

  /**
   * Edits the comment.
   * @param {Object} args - {id, ...changes}
   * @param {string} args.id - comment id.
   * @param {...string} args.changes - changes that should be made
   * @returns true if edited, otherwise false.
   */
  async function editComment(args) {
    const { id, ...changes } = args;

    if (!id) {
      throw new TypeError('Needs a comment id.');
    }

    const exists = await commentsDb.findById({ id });

    if (!exists) {
      throw new Error('Comment not found.');
    }
    console.log(changes);
    const newComment = makeComment({
      ...exists,
      ...changes,
      modifiedOn: null,
    });
    console.log(newComment.text);
    return commentsDb.update({
      comment: {
        id: newComment.id,
        text: newComment.text,
        modifiedOn: newComment.modifiedOn,
        published: newComment.published,
        hash: newComment.hash,
      },
    });
  }

  return editComment;
}

module.exports = buildEditComment;
