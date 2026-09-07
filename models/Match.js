const mongoose = require('mongoose');
const { mail } = require('./Ashimail');

const matchSchema = new mongoose.Schema({
    uid: { type: String, require: true, unique: true },
    pairs: [{
        uid: String,
        liked: Boolean,
        finished: Boolean,
        rating: String
    }],
    sentMail: [mail],
    receivedMail: [mail],
    mailBuilder: mail
});

const Match = mongoose.model("match", matchSchema);

module.exports = {
    Match,
    async getMatchData(uid) {
        const matchData = await Match.findOne({ uid });
        if (!matchData) return false;
        return matchData;
    },
    async updateMatch(uid, changes) {
        return await Match.findOneAndUpdate(
            { uid },
            changes,
            { returnDocument: "after" }
        );
    },
    async newMatchData(uid) {
        const existing = await Match.findOne({ uid });
        if (existing) return existing;

        return await Match.create({
            uid,
            pairs: [],
            sentMail: [],
            receivedMail: [],
            mailBuilder: {
                uid: "",
                anon: true,
                title: "",
                content: "",
                unread: true,
                dateSent: 0,
                signed: false
            }
        })
    },
    async newPairing(uid1, uid2, rating) {
        const matchData1 = await module.exports.newMatchData(uid1);
        const matchData2 = await module.exports.newMatchData(uid2);

        let pairs1 = matchData1.pairs;
        let pairs2 = matchData2.pairs;

        pairs1.push({
            uid: uid2,
            liked: false,
            finished: false,
            rating
        });

        pairs2.push({
            uid: uid1,
            liked: false,
            finished: false,
            rating
        });

        await module.exports.updateMatch(uid1, { pairs: pairs1 });
        await module.exports.updateMatch(uid2, { pairs: pairs2 });
    },
    async deleteMatchData(uid) {
        return await Match.findOneAndDelete({ uid });
    }
}