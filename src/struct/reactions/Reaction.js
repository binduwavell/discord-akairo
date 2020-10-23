const AkairoModule = require("../AkairoModule");

class Reaction extends AkairoModule {
  constructor(id, options = {}) {
    super(id, { category: options.category });
  }
  
  /**
   * Executes the response handler.
   * @abstract
   * @param {ReactionMessage} reaction - Message that triggered the reaction.
   * @param {string} reactionType - What type of action was perfromed (added or removed).
   * @param {User} user - User that triggered the reaction.
   * @param {any} args - Evaluated arguments.
   * @returns {any}
   */
  exec() {
    throw new AkairoError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
  }
}

module.exports = Reaction;
