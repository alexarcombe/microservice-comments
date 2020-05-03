/**
 *
 * @param {Object} args
 * @param {Function} args.Id - constructor function Id, needs to contain makeId method
 * @param {Function} args.hash - hash function to calc hash value.
 * @param {Function} args.sanitize - function to sanitaize the text, remove unvanted tags.
 * @param {Function} args.makeSource - function to check that the source is valid.
 * @returns {makeComment} makeComment
 */
function buildMakeComment(args) {
  const { Id, hash, sanitize, makeSource } = args;

  /**
   * Returns a comment.
   * @param {Object} args
   * @param {string} args.author - The comment text
   * @param {string} args.text - The comment text
   * @param {string} args.postId - The comment text
   * @param {string} args.replyToId - The comment text
   * @param {string} args.soure - Source
   * @param {string} [args.published=true] - The comment text
   * @param {string} [args.id] - The comment text
   * @param {string} [args.createdOn] - The comment text
   * @param {string} [args.modifiedOn] - The comment text
   * @returns {Object} comment
   */
  function makeComment(args = {}) {
    const {
      text,
      source,
      postId,
      replyToId,
      id = Id.makeId(),
      createdOn = Date.now(),
      modifiedOn = Date.now(),
    } = args;
    let { author, published = false } = args;

    if (!author) {
      throw new TypeError('Comment must have an author.');
    }
    if (author.length <= 3) {
      throw new TypeError("Author's name must be longer than 3 characters.");
    }
    if (!source) {
      throw new TypeError('Comment must have a source.');
    }
    if (!postId) {
      throw new TypeError('Comment must be connected to a postId.');
    }
    if (!text || text.length < 1) {
      throw new TypeError('Comment text must least once character.');
    }
    let sanitizedText = sanitize(text).trim();
    if (!sanitizedText || sanitizedText.length < 1) {
      throw new TypeError("Comment doesn't contain any usable text.");
    }

    const deletedText = 'This comment has been deleted.';
    let hashCode;
    return Object.freeze({
      id,
      createdOn,
      modifiedOn,
      postId,
      replyToId,
      source: makeSource(source),
      hashCode: hashCode || makeHash(),
      get author() {
        return author;
      },
      get text() {
        return sanitizedText;
      },
      get published() {
        return published;
      },
      get deleted() {
        return sanitizedText === deletedText;
      },
      setDeleted: () => {
        sanitizedText = deletedText;
        author = 'deleted';
      },
      publish: () => (published = true),
      unPublish: () => (published = false),
    });

    function makeHash() {
      return hash(sanitizedText.substring(0, 5) + author.substring(0, 5));
    }
  }

  return makeComment;
}

module.exports = buildMakeComment;
