/**
 * Returns a comments db object with methods to handle the db.
 * @param {Object} args
 * @param {Function} args.makeDb - Connection to the db
 * @param {string} [args.collection] - the name of the collection, default 'comments'
 * @returns Comments db object with methods to handle the db.
 */
function buildCommentsDB(args) {
  const { makeDb, collection = 'comments' } = args;

  return Object.freeze({
    findAll,
    findByHash,
    findById,
    findByPostId,
    findReplies,
    insert,
    remove,
    update,
  });

  /**
   * Returns all comments, only published will be returned if publishedOnly is true.
   * @async
   * @param {Object} [args = {}] - {[args.publishedOnly = true]}
   * @param {boolean} [args.publishedOnly = true] - Only published comments if true, default true.
   * @returns comments.
   */
  async function findAll(args = {}) {
    const { publishedOnly = true } = args;
    const db = await makeDb();
    const query = publishedOnly ? { published: true } : {};
    const result = await db
      .collection(collection)
      .find(query)
      .toArray();
    return result.map(({ _id: id, ...rest }) => ({
      id,
      ...rest,
    }));
  }

  /**
   * Returns the comment with the hash value if it exists, otherwise null;
   * @async
   * @param {Object} args - {hash}
   * @param {string} args.hash - The hash value to search for.
   * @returns comment.
   */
  async function findByHash(args) {
    const { hash } = args;
    const db = await makeDb();
    const query = { hash };
    const result = await db.collection(collection).findOne(query);
    if (!result) {
      return null;
    }
    const { _id: id, ...rest } = result;
    return { id, ...rest };
  }

  /**
   * Returns the comment with the id, otherwise null.
   * @async
   * @param {Object} args - {id}
   * @param {string} args.id - The id to search for.
   * @returns comment.
   */
  async function findById(args) {
    const { id: _id } = args;
    const db = await makeDb();
    const query = { _id };
    const result = await db.collection(collection).findOne(query);
    if (!result) {
      return null;
    }
    const { _id: id, ...rest } = result;
    return { id, ...rest };
  }

  /**
   * Returns comments connected to the post ID.
   * @async
   * @param {Object} args - postId to search on, ingnores replies to comments if ignoreRepliesTo.
   * @param {string} args.postId The post id to search on.
   * @param {boolean} [args.ignoreRepliesTo = true] Ignores replies to comments if true.
   * @returns list of comments
   */
  async function findByPostId(args) {
    const { postId, ignoreRepliesTo = true } = args;
    const db = await makeDb();
    const query = { postId };
    if (ignoreRepliesTo) {
      query.replyToId = null;
    }
    const result = await db
      .collection(collection)
      .find(query)
      .toArray();
    return result.map(({ _id: id, ...rest }) => ({ id, ...rest }));
  }

  /**
   * Find replies to a comment, needs a comment id to search on.
   * @async
   * @param {Object} args - {commentId, [publishedOnly = true]}
   * @param {string} args.commentId - The id of the comment to search for.
   * @param {boolean} [args.publishedOnly = true] - If true only returns published comments, default true.
   * @returns A list of replies.
   */
  async function findReplies(args) {
    const { commentId, publishedOnly = true } = args;
    const db = await makeDb();
    const query = { replyToId: commentId, published: publishedOnly };
    const result = await db
      .collection(collection)
      .find(query)
      .toArray();
    return result.map(({ _id: id, ...rest }) => ({ id, ...rest }));
  }

  /**
   * Inserts the comment in the db, the id needs to be uniq.
   * @async
   * @param {Object} args - {comment}
   * @param {Object} args.comment - A comment object.
   * @return comment if inserted, otherwise null.
   */
  async function insert(args) {
    const { comment } = args;
    const db = await makeDb();
    const { id: _id, ...rest } = comment;
    const result = await db.collection(collection).insertOne({ _id, ...rest });
    if (result.insertedCount > 0) {
      const { _id: id, ...rest } = result.ops[0];
      return { id, ...rest };
    }
    return null;
  }

  /**
   * Updates the comment in the db, the id needs to already be present.
   * @async
   * @param {Object} args - {comment}
   * @param {Object} args.comment - A comment object.
   * @return true if success, otherwise false.
   */
  async function update(args) {
    const { comment } = args;
    const db = await makeDb();
    const { id: _id, ...rest } = comment;
    const { matchedCount } = await db
      .collection(collection)
      .updateOne({ _id }, { $set: { ...rest } });
    return matchedCount > 0;
  }

  /**
   * Removes the comment with the id.
   * @async
   * @param {Object} args - {id}
   * @param {string} args.id - The id to remove.
   * @returns true if removed, otherwise false.
   */
  async function remove(args) {
    const { id: _id } = args;
    const db = await makeDb();
    const query = { _id };
    const { result } = await db.collection(collection).deleteOne(query);
    return result.ok === 1;
  }
}

module.exports = buildCommentsDB;
