module.exports = {
    getIdFromMention(mention) {
        if (!mention) return null;

        const match = mention.match(/^<(@&?|#)!?(\d+)>$/);

        return match ? match[2] : null;
    },
}