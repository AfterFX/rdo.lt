require('dotenv').config();

const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],});
const db = require('./database/database');


client.commands = new Collection();

//commands interactive
const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

//db
const User = require("./models/User");
const Messages = require("./models/Messages");

    client.on('ready', async () => {
        console.log("Bot is logged in!");
        await db.authenticate()
            .then(() => {
                console.log("Logged in to DB");
                User.init(db);
                User.sync();
                Messages.init(db);
                Messages.sync();
                Messages.findOrCreate({where: {id: 1}});
            }).catch(err => console.log(err));

        setInterval(ResetTime,(60*1000));//every 60s

         client.users.cache.forEach(member => { //creating users if not exits in database
             User.findOrCreate({
                 where: { userId: member.id }
             });
        });

    });

// client.on('interactionCreate', interaction => {
//     console.log(interaction);
// });

(async () => {
    for(file of functions){
        require(`./functions/${file}`)(client);
    }

    client.handleEvents(eventFiles, "./src/events")
    client.handleCommands(commandFolders, "./src/commands");
    await client.login(process.env.token);
})();


function ResetTime() {
    Messages.findOne({where: {id: 1}}).then(r => {
        if(r.time_schedule < Date.now()){
            r.time_schedule = (r.time_schedule+86400000);
            r.beforeNumber = r.total;
            r.save().then( () => {console.log("messages saved")});
        }
    })
}