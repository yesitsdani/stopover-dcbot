const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    gid: { type: String, require: true, unique: true },
    house1: Number,
    house2: Number,

    stealMania1: Number,
    stealMania2: Number,
});


const House = mongoose.model("house", houseSchema);
module.exports = {
    House,
    async getHouseData(gid) {
        return await House.findOneAndUpdate(
            { gid },
            {
                $setOnInsert: {
                    gid,
                    house1: 0,
                    house2: 0,

                    stealMania1: 0,
                    stealMania2: 0,
                }
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );
    },
    async updateHouseData(gid, changes) {
        return await House.findOneAndUpdate(
            { gid },
            changes,
            { returnDocument: 'after' }
        )
    },
    getHouse(member) {
        let house = "one";
        if (["1513016636280541234", "1515313966845267988", "1523321069438636203"].some(id => member.roles.cache.has(id))) house = "one";
        if (["1513016746326495286", "1521884104738607104", "1538537845302632548"].some(id => member.roles.cache.has(id))) house = "two";
        return house;
    }
};