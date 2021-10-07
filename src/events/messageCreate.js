const Messages = require("../models/Messages");
const User = require("../models/User");
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        await this.server_total_messages();
        await this.user_total_messages(message.author);

        const rowPlatformButtons = new MessageActionRow()
            .addComponents([this.verify_platform_getStart()]);
       if(message.content === "_welcome") {
            message.delete();
            client.channels.cache.get(process.env.welcomeChannelId).send({  embeds: [this.verify_aboutServer_embed(), this.verify_platform_embed()], components: [rowPlatformButtons] });
        }
    },
    verify_platform_getStart: () => {
        return new MessageButton()
            .setLabel('Pasirinkti role')
            .setEmoji("❓")
            .setStyle("SECONDARY")
            .setCustomId("welcome_platform_getStart_button")
    },
    verify_aboutServer_embed: () => {
        return new MessageEmbed()
            .setColor('#0099ff')
            .addField(`**GENERAL RULES**`, `Lietuviška **Red Dead Online** žaidimo bendruomenė, \n napjungianti visų platformų žaidėjus.\n**Serveryje rasi:** \n<:outlaw:893402804096483368> Custom **Outlaw** bota.\n<:sheriff:777209942931013633> Serverio Staff'as visada pagelbės esant klausimams.\n<:honorable:669866015437619200> Aktyvi bendruomenė, visada rasi būrį su kuo pažaisti.\n<:clue:777209925461999627> Naudingi patarimai, pagalba ir kita.`)
    },
    verify_platform_embed: () => {
        return new MessageEmbed()
            .setColor('#0099ff')
            .addField(`**PLATFORMOS ROLĖS**`, `Pasirink platforma, kuria naudoji žaisdamas Red Dead Online \n žaidimą, paspausdamas ant žemiau esančio platformos mygtuko.\n\n<:verify:893065643862159390> *Tik pasirinkę platformos rolę matysitę visus serverio kanalus.*`)
    },
    server_total_messages: async () => {
        await Messages.findOrCreate({
            where: {id: 1}
        }).then( ([r]) => {
            Messages.update(
                { total: r.total+1 },{ where: { id: 1 } }
            );
        } );
    },
    user_total_messages: async (member) => {
        console.log(member.id)
        await User.findOrCreate({
            where: {userId: member.id}
        }).then( ([r]) => {
            User.update(
                { messages: r.messages+1 },{ where: { userId: member.id } }
            );
        } );
    }
};