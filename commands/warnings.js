const Discord = require('discord.js')
const db = require('quick.db');

module.exports = {
    name: "warnings",
        aliases: ['경고확인'],
    description: "Check a users warnings",

    async run (client, message, args){
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author;


        let warnings = await db.get(`warnings_${message.guild.id}_${user.id}`);

        if(warnings === null) warnings = 0;

        message.channel.send(`**${user.username}**님의 경고 횟수 | *${warnings}*개 입니다.`);
    }
}