const Messages = require("../models/Messages");
const User = require("../models/User");
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        await this.server_total_messages();
        await this.user_exp(message.author);

        const rowPlatformButtons = new MessageActionRow()
            .addComponents([this.welcome_button()]);
       if(message.content === "_welcome") {
            message.delete();
            client.channels.cache.get(process.env.welcomeChannelId).send({  embeds: [this.welcome_1_embed(), this.welcome_2_embed()], components: [rowPlatformButtons] });
        }
    },
    welcome_button: () => {
        return new MessageButton()
            .setLabel('Pasirinkti role')
            .setEmoji("❓")
            .setStyle("SECONDARY")
            .setCustomId("welcome_platform_getStart_button")
    },
    welcome_1_embed: () => {
        return new MessageEmbed()
            .setColor('#0099ff')
            .addField(`**GENERAL RULES**`, `Lietuviška **Red Dead Online** žaidimo bendruomenė, \n napjungianti visų platformų žaidėjus.\n**Serveryje rasi:** \n<:outlaw:893402804096483368> Custom **Outlaw** bota.\n<:sheriff:777209942931013633> Serverio Staff'as visada pagelbės esant klausimams.\n<:honorable:669866015437619200> Aktyvi bendruomenė, visada rasi būrį su kuo pažaisti.\n<:clue:777209925461999627> Naudingi patarimai, pagalba ir kita.`)
    },
    welcome_2_embed: () => {
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
    user_exp: async (member) => {
        await User.findOrCreate({
            where: {userId: member.id}
        }).then( ([user]) => {
            user.messages = (user.messages+1);
            user.experience = (user.experience+(Number(process.env.experienceEachMsg)));
            user.save().then((user) => {
                // while(module.exports.levelUP(user)){
                    module.exports.levelUP(user);
                // }
            });

        } );
    },
    levelUP: (user) => {
        let FullLevelRequiredXP = (user.level+1)*100;
        do {
            if(user.experience >= FullLevelRequiredXP) {

                FullLevelRequiredXP = (user.level+1)*100;
                user.level++;
                if(user.experience < FullLevelRequiredXP) break;
                user.experience = user.experience - FullLevelRequiredXP;

                (Math.floor((user.level)/5) === (user.level)/5) ? user.treasureMaps++ : false;//giving treasure maps every 5 lvl
            }
        }
        while (user.experience >= FullLevelRequiredXP);
        user.save();
    }
};