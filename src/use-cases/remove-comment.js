/**
 * Builds and returns remove comment.
 * @param {Object} args - { commentsDb }
 * @param {Object} args.commentsDb - Comments db object.
 * @returns {removeComment} - removeComment
 */
function buildRemoveComment(args) {
  const { commentsDb } = args;

  /**
   * Deletes the comment with the id.
   * @param {Object} args - { id }
   * @param {string} args.id - id of the comment to remove.
   * @returns true if deleted, otherwise false.
   */
  async function removeComment(args) {
    const { id } = args;
    return await commentsDb.remove({ id });
  }

  return removeComment;
}

module.exports = buildRemoveComment;
