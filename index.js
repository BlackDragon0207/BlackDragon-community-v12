const Discord = require('discord.js');
const client = new Discord.Client();
const { token, default_prefix } = require('./config.json');
const { readdirSync } = require('fs');
const { join } = require('path');
const config = require('./config.json');
client.config = config;
const db = require('quick.db');
const message = [' ']
let current = 1;

client.commands= new Discord.Collection();
//You can change the prefix if you like. It doesn't have to be ! or ;
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
    if(command.aliases){
        for(const alias of command.aliases)
        client.commands.set(alias, command);
    }
}

client.on("error", console.error);

client.on('ready', () => {
    console.log('I am ready');

    setInterval(() => {
        if(message[current]){
            client.user.setActivity(`BlackDragon Community`, { type: "COMPETING"})
        current++;
        }else{
            current = 0;
            client.user.setActivity(`Community Member | ${client.guilds.cache.get('436048224617365524').members.cache.size}명`, { type: "PLAYING"})
        }
    }, 5*1500)
});

client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    let prefix = await db.get(`prefix_${message.guild.id}`);
    if(prefix === null) prefix = default_prefix;

    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);


    if(prefixRegex.test(message.content)){
        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        const command = args.shift().toLowerCase();

        if(!client.commands.has(command)) return;


        try {
            client.commands.get(command).run(client, message, args);

        } catch (error){
            console.error(error);
        }
    }
})

client.login(token)