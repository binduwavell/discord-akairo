const AkairoHandler = require("../AkairoHandler");
const { ReactionHandlerEvents } = require('../../util/Constants');
const Reaction = require("./Reaction");

class ReactionHandler extends AkairoHandler {
  constructor(client, {
    directory,
    classToHandle = Reaction,
    extensions = ['.js', '.ts'],
    automateCategories,
    loadFilter
  } = {}) {
    if (!(classToHandle.prototype instanceof Reaction || classToHandle === Reaction)) {
      throw new AkairoError('INVALID_CLASS_TO_HANDLE', classToHandle.name, Reaction.name);
    }

    super(client, {
      directory,
      classToHandle,
      extensions,
      automateCategories,
      loadFilter
    });

    this.setup();
  }

  /**
   * Register handlers for reaction events.
   * @returns {void}
   */
  setup() {
    this.client.once('ready', () => {
      this.client.on('messageReactionAdd', async (r, u) => {
        console.log("REACTION ADDED");
        if (r.message.partial) await r.message.fetch();
        if (u.partial) await u.fetch();
        this.handle(r, 'added', u)
      })
      this.client.on('messageReactionRemove', async (r, u) => {
        console.log("REACTION REMOVED");
        if (r.message.partial) await r.message.fetch();
        if (u.partial) await u.fetch();
        this.handle(r, 'removed', u)
      })
    });
  }

  /**
   * Handle a reaction interaction.
   * @param {MessageReaction} messageReaction = Message that triggered the reaction.
   * @param {string} reactionType - What type of action was perfromed (added or removed).
   * @param {User} user - User that triggered the reaction.
   * @returns {void}
   */
  async handle(messageReaction, reactionType, user) {
    try {
      for (var [ id, reaction ] of this.modules) {
        this.emit(ReactionHandlerEvents.REACTION_STARTED, messageReaction, reactionType, user, reaction);
        console.log(`Executing reaction handler for ${id}`);
        await reaction.exec(messageReaction, reactionType, user);
        this.emit(ReactionHandlerEvents.REACTION_FINISHED, messageReaction, reactionType, user, reaction);
      }
    } catch (err) {
      this.emitError(err, messageReaction, reactionType, user)
    }
  }

  /**
   * Handles errors from the handling.
   * @param {Error} err - The error.
   * @param {MessageReaction} messageReaction - Message that triggered the reaction.
   * @param {string} reactionType - What type of action was performed (added or removed).
   * @param {User} user - User that triggered the reaction.
   * @param {Reaction} [reaction] - Reaction that errored.
   * @returns {void}
   */
  emitError(err, messageReaction, reactionType, user, reaction) {
    if (this.listenerCount(ReactionHandlerEvents.ERROR)) {
       this.emit(ReactionHandlerEvents.ERROR, err, messageReaction, reactionType, user, reaction);
       return;
    }
    throw err;
  }
}

module.exports = ReactionHandler;