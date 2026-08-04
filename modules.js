module.exports = {
    getIdFromMention(input) {
        if (!input) return null;

        // Already a Discord ID
        if (/^\d{17,20}$/.test(input)) {
            return input;
        }

        // User, role, or channel mention
        const match = input.match(/^<(?:@!?|@&|#)(\d+)>$/);

        return match ? match[1] : null;
    }
}