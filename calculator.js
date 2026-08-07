module.exports = {
    matchType(enemyInfo, playerInfo) {
        return false;
    },
    nextLevel(level) {
        return 50 + (50 * parseInt(level));
    },
}