const mongoose = require('mongoose');

const rpgSchema = new mongoose.Schema({
    uid: { type: String, require: true, unique: true },
    class: String,
    xp: Number,
    level: Number,
    area: Number,
    health: Number,
    maxHealth: Number,
    dead: Boolean,
    weap: {
        id: String,
        enchantment: String,
        cursed: Boolean,
    },
    armor: {
        id: String,
        enchantment: String
    },
    mainSkill: String,
    skills: [String],
    blessed: Boolean,
    enemiesSlayed: [String],
    rune: {
        id: String,
        level: Number
    },
    tools: [
        { id: String, durability: Number }
    ]
});

const Rpg = mongoose.model("rpg", rpgSchema);
module.exports = Rpg;