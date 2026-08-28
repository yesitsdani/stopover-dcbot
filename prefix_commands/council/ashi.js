const User = require('../../models/User');
const { getIdFromMention, getUser } = require(`../../modules`);
const ms = require('ms');

module.exports = {
    name: 'ashi',
    description: 'Test command',
    category: 'admin',
    usage: '`stp ashi [argument]`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        const setTime = new Date(2026, 5, 14).getTime();
        if (!args[0]) return message.reply(`Please set argument`)

        let uid = message.author.id;
        let marriage;

        if (args[0] == 'marryzion') {
            marriage = {
                uid: "764037666538651658",
                date: setTime,
                ring: "ringF",
                status: "Married"
            }
        } else if (args[0] == 'marrytimmy') {
            marriage = {
                uid: "762483844267769897",
                date: 1787654979321,
                ring: "ringF",
                status: "Married"
            }
        } else if (args[0] == 'zionmarry') {
            uid = "764037666538651658";
            marriage = {
                uid: message.author.id,
                date: setTime,
                ring: "ringF",
                status: "Married"
            }
        } else if (args[0] == 'timmymarry') {
            uid = "762483844267769897";
            marriage = {
                uid: message.author.id,
                date: 1787654979321,
                ring: "ringF",
                status: "Married"
            }
        } else if (args[0] == 'zionclear') {
            uid = "764037666538651658";
            marriage = {
                uid: "",
                date: 0,
                ring: '',
                status: ''
            }
        } else if (args[0] == 'timmyclear') {
            uid = "762483844267769897";
            marriage = {
                uid: "",
                date: 0,
                ring: '',
                status: ''
            }
        } else if (args[0] == 'daniclear') {
            uid = "811596799663800341";
            marriage = {
                uid: "",
                date: 0,
                ring: '',
                status: ''
            }
        } else if (args[0] == 'clear') {
            marriage = {
                uid: "",
                date: 0,
                ring: "",
                status: ""
            }
        } else if (args[0] == 'seemarriage') {
            const userData = await getUser(uid);
            return console.log(userData.marriage);
        } else {
            return message.reply(`Invalid arguments`)
        }

        await User.findOneAndUpdate(
            { uid },
            { marriage },
            { returnDocument: "after" }
        );

        await message.reply(`Done`);
    }
}