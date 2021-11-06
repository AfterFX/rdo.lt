const Messages = require("../models/Messages");
const User = require("../models/User");
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js');
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
            const file = new MessageAttachment('src/img/RDO.lt-welcome2.png');
            client.channels.cache.get(process.env.welcomeChannelId).send({  embeds: [this.welcome_1_embed(), this.welcome_2_embed()], components: [rowPlatformButtons], files: [file] });
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
            .setColor('#C98309')
            .addField(`APIE RDO.LT SERVERĮ`, `Lietuviška **Red Dead Online** žaidimo bendruomenė, \napjungianti visų platformų žaidėjus.\n\n**Serveryje rasi:** \n<:outlaw:893398357345710100> Custom **Outlaw** bota.\n<:Sheriff:903901548831207454> Serverio Staff'as visada pagelbės esant klausimams.\n<:members:903901535040323595> Aktyvi bendruomenė, visada rasi būrį su kuo pažaisti.\n<:clue:903901498692493373> Naudingi patarimai, pagalba ir kita.`)
    },
    welcome_2_embed: () => {
        return new MessageEmbed()
            .setColor('#C98309')
            .addField(`PLATFORMOS ROLĖS`, `Pasirink platforma, kuria naudoji žaisdamas Red Dead Online\nžaidimą, paspausdamas ant žemiau esančio mygtuko.\n\n<a:verify:903904699953066025> *Bendrauti galėsitę, tik pasirinkę platformos rolę.*`)
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
                let reward = (treasureMapsReward)? `Reward: ${treasureMapsReward} treasure map(s)` : "";
                client.channels.cache.get(process.env.notificationsChannelId).send({content: `<@${user.id}> has achieved the ${r.level} level.\n ${reward}`});
            });
        }
    }
};