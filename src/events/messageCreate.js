const Messages = require("../models/Messages");
const User = require("../models/User");
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        await this.server_total_messages();
        await this.user_exp(message.author, client);

        const rowPlatformButtons = new MessageActionRow()
            .addComponents([this.welcome_button()]);
       if(message.content === "_welcome") {
            message.delete();
            client.channels.cache.get(process.env.welcomeChannelId).send({  embeds: [this.welcome_1_embed(), this.welcome_2_embed()], components: [rowPlatformButtons] });
       }else if(message.content === "_embed"){
           message.delete();
           client.channels.cache.get(message.channelId).send({  embeds: [this.embed()] });
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
            .addField(`**GENERAL RULES**`, `Lietuviška **Red Dead Online** žaidimo bendruomenė, \n apjungianti visų platformų žaidėjus.\n**Serveryje rasi:** \n<:outlaw:893402804096483368> Custom **Outlaw** bota.\n<:sheriff:777209942931013633> Serverio Staff'as visada pagelbės esant klausimams.\n<:honorable:669866015437619200> Aktyvi bendruomenė, visada rasi būrį su kuo pažaisti.\n<:clue:777209925461999627> Naudingi patarimai, pagalba ir kita.`)
    },
    welcome_2_embed: () => {
        return new MessageEmbed()
            .setColor('#0099ff')
            .addField(`**PLATFORMOS ROLĖS**`, `Pasirink platforma, kuria naudoji žaisdamas Red Dead Online \n žaidimą, paspausdamas ant žemiau esančio platformos mygtuko.\n\n<:verify:893065643862159390> *Tik pasirinkę platformos rolę matysitę visus serverio kanalus.*`)
    },
    embed: () => {
        return new MessageEmbed()
            .setColor('#7a0273')
            .setDescription(`**EMBED READY!**`)
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
    user_exp: async (user, client) => {
        await User.findOrCreate({
            where: {userId: user.id}
        }).then( ([r]) => {
            r.messages = (r.messages+1);
            r.experience = (r.experience+(Number(process.env.experienceEachMsg)));
            r.save().then((r) => {
                    module.exports.levelUP(client, r, user);
            });

        } );
    },
    levelUP: (client, r, user) => {
        let treasureMapsReward = 0;
        let FullLevelRequiredXP = (r.level+1)*100;
        let levelUp = false;
        do {
            if(r.experience >= FullLevelRequiredXP) {
                levelUp = true;
                FullLevelRequiredXP = (r.level+1)*100;
                if(r.experience < FullLevelRequiredXP) break;
                r.level++;
                r.experience = r.experience - FullLevelRequiredXP;
                (Math.floor((r.level)/5) === (r.level)/5) ? r.treasureMaps++ && treasureMapsReward++ : false;//giving treasure maps every 5 lvl

            }
        }
        while (r.experience >= FullLevelRequiredXP);
        if(levelUp){
            r.save().then((r) => {
                client.channels.cache.get(process.env.notificationsChannelId).send({content: `|| <@${user.id}> ||`,  embeds: [module.exports.levelUpNotification(r, user, treasureMapsReward)] });
            });
        }
    },
    levelUpNotification: (r, user, treasureMapsReward) => {
        let reward = (treasureMapsReward)? `Reward: ${treasureMapsReward} treasure map(s)` : "";
        return new MessageEmbed()
            .setColor('#0099ff')
            .setDescription(`**Level Up**\n ${user.username} has achievement the ${r.level} level.\n ${reward}`)

    }
};