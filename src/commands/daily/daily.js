const User = require("../../models/User");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    permission: "SEND_MESSAGES",
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Do every day daily and get rewards!'),
    async execute(interaction) {
        await User.findOne({ where: { userId: interaction.user.id } }).then((user) => {
            if (user.dailyLastDate === "0"){//for first time using daily
                user.gold = (user.gold+0.3);
                user.dailyStreak = user.dailyStreak+1;
                user.dailyLastDate = new Date().toLocaleDateString();
                user.save().then(interaction.reply({embeds: [this.first_daily_embed(0.3, interaction.user)], ephemeral: true}));
            }else if(this.diffDate(user.dailyLastDate) > 1){//reset
                let dailyStreak = user.dailyStreak; //fetch old daily streak
                let dailyLastDate = user.dailyLastDate; //fetch old daily streak
                let goldBonus = Number(((this.daily_gold(user)*dailyStreak)/2).toFixed(2));
                user.gold = (user.gold+goldBonus);
                user.dailyStreak = 1;//reset daily if days>1
                user.dailyLastDate = new Date().toLocaleDateString();
                user.save().then(interaction.reply({embeds: [this.daily_reset_embed(false, goldBonus, dailyStreak, dailyLastDate)], ephemeral: true}))
                    .then(() => {
                        interaction.member.guild.channels.cache.get(process.env.notificationsChannelId).send({content: `<:sadarthur:901356794771816488> <@${interaction.user.id}> lost **${dailyStreak}** daily streak. Reward bonus **${goldBonus}**<:goldbar:901352183134580786>`})
                    });
            }else if(this.diffDate(user.dailyLastDate) === 1){
                let streakGold = this.daily_gold(user);
                user.gold = (user.gold+streakGold);
                user.dailyStreak = user.dailyStreak+1;
                user.dailyLastDate = new Date().toLocaleDateString();
                user.save().then(interaction.reply({embeds: [this.daily_reward_embed(false, streakGold, user.dailyStreak)], ephemeral: true}))
                    .then(() => {
                    interaction.member.guild.channels.cache.get(process.env.notificationsChannelId).send({content: `<@${interaction.user.id}> Daily completed. Reward: **${streakGold}**<:goldbar:901352183134580786> Current streak: ${user.dailyStreak} days`})
                    });
            }else if(this.diffDate(user.dailyLastDate) === 0){
                interaction.reply({embeds: [this.daily_stop_embed()], ephemeral: true});
            }
        });
    },
    diffDate: (dailyLastDate) => {
        const date1 = new Date(dailyLastDate);
        const date2 = new Date(new Date().toLocaleDateString());
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    first_daily_embed: (gold, user) => {
        return new MessageEmbed()
            .setColor('#0E545A')
            .setDescription(`<:hello:901360201544908840> Hi ${user.username}, you first time using daily command. \nDo daily and get Gold! Do every day get more and more gold with daily streak!`)
            .addFields({ name: 'Information how work daily streak:', value: 'Do daily every day and get streak. \n**Streak bonus:** If your streak more then 7 days you will get 0.5 gold, then more 21 days you will get 0.9 gold.\n**Important:** If you miss do daily command you will lose streak. For first day you got 0.3 gold' },)
    },
    daily_reward_embed: (user, gold, streak) => {
        return new MessageEmbed()
            .setColor('#8669FA')
            .setDescription(`<:DailyComplete:901349458216898570> **Daily completed**\nDaily challenge reward **${gold}** <:goldbar:901352183134580786>`)
            .setFooter(`Current streak: ${streak} days`)
    },
    daily_reset_embed: (user, gold, dailyStreak, date) =>{
        return new MessageEmbed()
            .setColor('#494949')
            .setDescription(`**<:sadarthur:901356794771816488> You lost ${dailyStreak} daily streak**\nReward bonus **${gold}** <:goldbar:901352183134580786> `)
            .setFooter(`Last daily streak`)
            .setTimestamp(date)
    },
    daily_stop_embed: () => {
        return new MessageEmbed()
            .setColor('#9C821B')
            .setDescription(`<:no:901362061316063242> You are already have a daily challenge! Try again tomorrow.`)
    },
    daily_gold: (user) => {
        return (user.dailyStreak < 7)? 0.3 : (user.dailyStreak < 21)? 0.5 : 0.9;
    }
};