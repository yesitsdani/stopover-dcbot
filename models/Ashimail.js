
const mongoose = require('mongoose');

const mail = {
    uid: String,
    anon: Boolean,
    title: String,
    content: String,
    unread: Boolean,
    dateSent: Number,
    signed: Boolean
}

const ashimailSchema = new mongoose.Schema({
    uid: { type: String, require: true, unique: true },
    receivedMail: [mail],
    sentMail: [mail],
    matches: [{
        uid: String,
        liked: Boolean,
        rating: Number
    }],
    ashimailAddress: String,
    ashimailPass: String,
    sessionUntil: Number,
    mailBuilder: mail
});

const Ashimail = mongoose.model("ashimail", ashimailSchema);
module.exports = {
    Ashimail,
    async updateAshimail(uid, changes) {
        return await Ashimail.findOneAndUpdate(
            { uid },
            changes,
            { returnDocument: "after" }
        )
    }
};