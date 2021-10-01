
global.localhost = false; //difference settings for localhost and VPS
let config;
if(localhost === true){
    config = require("./local_config.json");
}else{
    config = require("./config.json");
}



const Discord = require("discord.js");

const { Client, Intents, Collection, MessageActionRow, MessageButton, MessageAttachment, MessageEmbed, MessageSelectMenu  } = require('discord.js')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, guild, DevClient } = require('./config.json');
const fs = require('fs');

const commands = [];
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const clientId = DevClient.id;
const guildId = guild.id;


const { SlashCommandBuilder } = require('@discordjs/builders');

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);


(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();


//constructor
const functions = require("./functions/index");

const databaseFile = './database.json';
const database = require(databaseFile);

const mysql = require('mysql2/promise');



client.on("ready", async () => {




    const command = await createGuildCommand({
        name: "report",
        description: "command report",
        options: [{
            name: "user",
            description: "deer user",
            type: 6,
            required: true
        },
            {
                name: "reason",
                description: "what?",
                type: 3,
                required: true,
                choices: [
                    {
                        name: "Option 1",
                        value: "1"
                    },
                    {
                        name: "Option 2",
                        value: "2"
                    },
                    {
                        name: "Option 3",
                        value: "3"
                    },
                ]
            },
            {
                name: "comment",
                description: "bbz",
                type: 3,
                required: true
            }]
    }, "881910228004782081")
    const command1 = await createGuildCommand({
        name: "High Five",
        type: 2
    }, "881910228004782081")
    const command2 = await createGuildCommand({
        name: "+Respect",
        type: 3
    }, "881910228004782081")
    const command3 = await createGuildCommand({
        name: "ping",
        // description: "command report",
        type: 3,
    }, "881910228004782081")
    const command4= await createGuildCommand({
        name: "test2",
        description: "f.....g amazing",
        type: 1
    }, "881910228004782081")

    // console.log(command)
    // console.log(command1)
    // console.log(command2)
    // console.log(command3)
    // console.log(command4)




    //Mysql
    try {
        var connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'onb_discord', password: config.password,});
        console.log("Mysql connected");
    } catch (err) {
        console.log("---------------------------------------");
        console.log("!!!fix mysql connection!!!")
        console.log("message: " + err.message);
        console.log("code: " + err.code);
        console.log("errorno: " + err.errno);
        console.log("sqlState: " + err.sqlState);
        console.log("---------------------------------------");
        console.log("server connection closed")
        process.exit();
    }

    console.log("I am ready!");
        let guild_cache = client.guilds.cache.get(config.guild.id); // get guild cache
    console.log(`Logged in as ${client.user.tag}!`);

    global.role_list = function role_list(role){
        return guild_cache.roles.cache.find(r => r.name === role);
    };




    function checkResetTime() {
        let promiseData = functions.MySQL(false, "SELECT" , "messages", connection);
        return promiseData.then(function(messagesData) {
            let totalMsg = messagesData.total;

            if(messagesData.time_schedule < Date.now()){
                let sql = "UPDATE messages SET time_schedule = time_schedule+86400000, beforeNumber = " + totalMsg + "";
                functions.MySQL(sql, false, false, connection);
            }


        });
    }




    //every 1s checking mutes, if found expires will unmute.
    setInterval(functions.checkMute,2000, connection, client, config);
    //checking when need reset message count "today
    setInterval(checkResetTime,2000);


    // const totalMsg = await checkResetTime();
    // console.log(totalMsg);





    // try {
    //     console.log("---------------------------------------");
    //     //Fetch ✅verified message to cache.
    //     await client.channels.cache.get(config["VerifiedChannelId"]).messages.fetch(config["verifiedFetchMessage"]);
    //     console.log("Message added to 「✅」verified channel");
    //     //Fetch 👀informacija message to cache.
    //     await client.channels.cache.get(config["informacijaChannelId"]).messages.fetch(config["InformacijaFetchMessage"]);
    //     console.log("Message added to 「🧨」informacija channel");
    //     //Fetch treasure-map message to cache.
    //     await client.channels.cache.get(config["treasureMapChannel"]).messages.fetch(config["treasureMapMessage"]);
    //     console.log("Message added to treasure-map channel");
    //     console.log("---------------------------------------");
    // } catch(e) {
    //     console.log("Message not added to channel. Try fix ids.");
    // }




    functions.setActivity(client);
    setInterval(functions.setActivity,3600000, client);
    require("./model/message")(client, config.dev_ids, fs, databaseFile, database, config, connection, config.prefix, MessageAttachment);
    require("./model/messageReactionAdd")(client, connection, config, functions);
    require("./model/messageReactionRemove")(client, config);
    require("./model/guildMemberAdd")(client, functions, config, connection, MessageAttachment);


    client.users.cache.forEach(member => { //creating users if not exits in database
        functions.UserData(connection, member.id, member.username)
    });
});

async function createGuildCommand(data, guildID){
    // client.api.applications(client.user.id).commands('884804747511603270').delete();

    return await client.api.applications(client.user.id).guilds(guildID).commands.post({
        data: data
    })
}
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
    // if (!interaction.isCommand()) return;
    console.log(interaction);
    const wait = require('util').promisify(setTimeout);

    let SelectMenu = new MessageSelectMenu()
        .setCustomId("button_five")
        .addOptions([

            {
                label: 'Member',
                emoji: '1️⃣',
                description: 'Members can view and chat in all public channels',
                value: 'member',
            },

            {
                label: 'Booster',
                emoji: '2️⃣',
                description: 'boosters can view and chat in all channels + special channels',
                value: 'booster',
            },

            {
                label: 'Admin',
                discriminator: "1337",
                emoji: "<:outlaw:886602455838761050>",
                description: 'Has all permissions in the server',
                value: 'Admin',
            },

            {
                label: 'Visitor',
                emoji: '1️⃣',
                description: 'View only permissions',
                value: 'Visitor',
            },

        ])
        .setPlaceholder("Choose a class")
        .setMinValues(1)
        .setMaxValues(3)

    let button1 = new MessageButton()
        .setLabel('Primary')
        .setEmoji("1️⃣")
        .setStyle("PRIMARY")
        .setCustomId("button_one")

    let button2 = new MessageButton()
        .setLabel('Secondary')
        .setEmoji("2️⃣")
        .setStyle("SECONDARY")
        .setCustomId("button_two")

    let button3 = new MessageButton()
        .setLabel('Success')
        .setEmoji("3️⃣")
        .setStyle("SUCCESS")
        .setCustomId("button_three")

    let button4 = new MessageButton()
        .setLabel('Danger')
        .setEmoji("<:outlaw:886602455838761050>")
        .setStyle("DANGER")
        .setCustomId("button_four")

    //If You Don't Need 5th Button Remove The 4 Lines Below and Remove Line 67
    let button5 = new MessageButton()
        .setLabel("None Of The Above")
        .setStyle("SUCCESS")
        .setEmoji("🤷🏻‍♂️")
        .setCustomId("none_of_the_above")

    let button6 = new MessageButton()
        .setLabel("Delivery channel")
        .setStyle("LINK")
        .setURL("https://discord.com/channels/881910228004782081/881923784439922698")







    if (interaction.commandName === 'test1') {
        const row = new MessageActionRow()
            .addComponents([button1, button2, button6, button4, button5]);

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Some title')
            .setURL('https://discord.js.org')
            .setDescription('Some description here');

        await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });
    }else if (interaction.commandName === 'test2') {
        const row = new MessageActionRow()
            .addComponents([SelectMenu]);

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Some title')
            .setURL('https://discord.js.org')
            .setDescription('Some description here');

        await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });
    }


    const filter = i => i.customId === 'button_one' || i.customId === "button_five";

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 0 }); //default 1500

    collector.on('collect', async i => {
        console.log(i.values)
        if (i.customId === 'button_one') {
            await i.deferUpdate();
            // await wait(2000);
            await i.editReply({ content: 'A button was clicked!', components: [] });
        }else if (i.values.indexOf("member") > -1 || i.values.indexOf("booster") > -1 || i.values.indexOf("Admin") > -1 || i.values.indexOf("Visitor") > -1) {//member, booster, Admin, Visitor
            await i.deferUpdate();
            // await wait(2000);
            await i.editReply({ content: 'A button was clicked!', components: [] });
        }
    });

    collector.on('end', collected => console.log(`Collected ${collected.size} items`));





    client.api.applications(client.user.id).guilds("881910228004782081").commands(interaction.data.id).delete() //881910228004782081 = guild ID, apps deleter, use this when interaction create command is off


    if (interaction.data.name === "test") {
        await sendWaiting(interaction)
        // new Discord.WebhookClient(client.user.id, interaction.token).send("Test")
        sendUserMessage(interaction, "MOIN")
    }else if (interaction.data.name === "report"){
        let userID = interaction.data.options[0].value
        let reason = interaction.data.options[1].value
        let comment = interaction.data.options[2].value
        await sendWaiting(interaction);

        new Discord.WebhookClient(client.user.id, interaction.token).send(new Discord.MessageEmbed({title:"Report", description:`Reported <@${userID}> , Reason ${reason}, Comment ${comment ? comment : "none"}`}))
    }else if (interaction.data.name === "High Five"){
        await sendWaiting(interaction);
        new Discord.WebhookClient(client.user.id, interaction.token).send(new Discord.MessageEmbed({title:"High Five", description:`<@${interaction.data["target_id"]}> High Five from <@${interaction.member.user.id}>`}))
    }else if (interaction.data.name === "+Respect"){
        await sendWaiting(interaction);
        const authorID = interaction.data.resolved.messages[interaction.data["target_id"]].author.id;
        new Discord.WebhookClient(client.user.id, interaction.token).send(new Discord.MessageEmbed({title:"+Respect", description:`<@${authorID}> respect received from <@${interaction.member.user.id}>`}))
    }else if (interaction.data.name === "ping"){
        // await sendWaiting(interaction);
        // new Discord.WebhookClient(client.user.id, interaction.token).send("pong")
        const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('primary')
                        .setLabel('Primary')
                        .setStyle('PRIMARY'),
                );

            return await interaction.reply({ content: 'Pong!', components: [row] });
    }
})

function sendWaiting(interaction) {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 5
        }
    })
}

function sendUserMessage(interaction, content) {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: {
                content: content,
                flags: 64
            }
        }
    })
}



client.login(config.token);
