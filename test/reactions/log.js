const { Reaction } = require('../..');

class LogReaction extends Reaction {
    constructor() {
        super('log-reactions', {});
    }

    exec(reaction, reactionType, user) {
        console.log(`User <@${user.id}> ${reactionType} ${reaction.emoji} to/from ${reaction.message.id}.`);
    }
}

module.exports = LogReaction;