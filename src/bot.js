require('dotenv').config();

const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'EMOJI'],});
const db = require('./database/database');

let newswire = require('./newswire');


client.commands = new Collection();

//commands interactive
const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

//db
const User = require("./models/User");
// const User1 = require("./models/User1");//todo helps transfer users from one to another. after transfer need delete this code
const Messages = require("./models/Messages");

    client.on('ready', async () => {
        new newswire("rdr2", client);// auto posting news from rdr2
        console.log("Bot is logged in!");
        await db.authenticate()
            .then(() => {
                console.log("Logged in to DB");
                User.init(db);
                // User1.init(db);//todo helps transfer users from one to another. after transfer need delete this code
                // User1.sync();//todo helps transfer users from one to another. after transfer need delete this code
                User.sync();
                Messages.init(db);
                Messages.sync();
                Messages.findOrCreate({where: {id: 1}});
            }).catch(err => console.log(err));
        setInterval(ResetTime,(60*1000));//every 60s



        // const users = await User1.findAll();//todo helps transfer users from one to another. after transfer need delete this code
        // console.log(users.every(user => user instanceof User1)); // true
        // users.forEach(member => { //creating users if not exits in database
        //     User.findOrCreate({
        //         where: { userId: member.id }
        //     }).then(([r]) => {
        //         r.userId = (member.userID);
        //         r.money = (member.money);
        //         r.gold = (member.gold);
        //         r.level = (member.level);
        //         r.experience = (member.experience);
        //         r.messages = (member.messages);
        //         r.dailyLastDate = (member.dailyLastDate);
        //         r.dailyStreak = (member.dailyStreak);
        //         r.treasureMaps = (member.treasureMaps);
        //         r.save();
        //     });
        // });



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