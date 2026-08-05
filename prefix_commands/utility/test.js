const User = require('../../models/User');
const { getIdFromMention } = require(`../../modules`);
const ms = require('ms');

module.exports = {
    name: 'test',
    description: 'Test command',
    category: 'utility',
    usage: '`stp help [command]`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        const setTime = new Date(2026, 5, 14).getTime();

        let uid = message.author.id;
        let marriage = {
            uid: "764037666538651658",
            date: setTime,
            ring: "ringF",
            status: "Married"
        }

        if (args[0] == 'zion') {
            uid = "764037666538651658";
            marriage = {
                uid: message.author.id,
                date: setTime,
                ring: "ringF",
                status: "Married"
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
        } 

        await User.findOneAndUpdate(
            { uid },
            { marriage },
            { returnDocument: "after" }
        );

        await message.reply(`Done`)
    }
}