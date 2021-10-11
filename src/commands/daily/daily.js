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
                let goldBonus = ((this.daily_gold(user)*dailyStreak)/2);
                user.gold = (user.gold+goldBonus);
                user.dailyStreak = 1;//reset daily if days>1
                user.dailyLastDate = new Date().toLocaleDateString();
                user.save().then(interaction.reply({embeds: [this.daily_reset_embed(false, goldBonus, dailyStreak, dailyLastDate, false)], ephemeral: true}))
                    .then(() => {
                        interaction.member.guild.channels.cache.get(process.env.notificationsChannelId).send({embeds: [this.daily_reset_embed(interaction.user, goldBonus, dailyStreak, dailyLastDate, true)], ephemeral: false})
                    });
            }else if(this.diffDate(user.dailyLastDate) === 1){
                let streakGold = this.daily_gold(user);
                user.gold = (user.gold+streakGold);
                user.dailyStreak = user.dailyStreak+1;
                user.dailyLastDate = new Date().toLocaleDateString();
                user.save().then(interaction.reply({embeds: [this.daily_reward_embed(false, streakGold, user.dailyStreak, false)], ephemeral: true}))
                    .then(() => {
                    interaction.member.guild.channels.cache.get(process.env.notificationsChannelId).send({embeds: [this.daily_reward_embed(interaction.user, streakGold, user.dailyStreak, true)], ephemeral: false})
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
            .setColor('#d9c600')
            .setDescription(`👋 Hi ${user.username}, you first time using daily command. Do daily and get Gold! Do every day get more and more gold with daily streak! Information how work daily streak: do daily every day and get streak. Streak bonus: if your streak more then 7days you will get 0.5 gold, then more 21 days you will get 0.9gold. **Important: If you miss do daily command you will lose streak.**\n for first day you got ${gold} gold`)
    },
    daily_reward_embed: (user, gold, streak, notification) => {
        if(notification){
            var text = `**Daily challenge**\n 👌 ${user.username} daily completed. Gold: ${gold}, current streak: ${streak} days`;
        }else{
            var text = `👌 daily completed. Gold: ${gold}, current streak: ${streak} days`;
        }
        return new MessageEmbed()
            .setColor('#42b700')
            .setDescription(text)
    },
    daily_reset_embed: (user, gold, dailyStreak, date, notification) =>{
        if(notification){
            var text = `**Daily challenge**\n ${user.username} lost ${dailyStreak} daily streak :( last daily streak: ${date}, reward gold: ${gold}`;
        }else{
            var text = `You lost ${dailyStreak} daily streak :( last daily streak: ${date}, reward gold: ${gold}`;
        }
        return new MessageEmbed()
            .setColor('#b70000')
            .setDescription(text)
    },
    daily_stop_embed: () => {
        return new MessageEmbed()
            .setColor('#b70000')
            .setDescription(`🛑 You are already have a daily challenge!`)
    },
    daily_gold: (user) => {
        return (user.dailyStreak < 7)? 0.3 : (user.dailyStreak < 21)? 0.5 : 0.9;
    }
};