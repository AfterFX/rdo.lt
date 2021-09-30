const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember, client) {
        const oldStatus = oldMember.premiumSince;
        const newStatus = newMember.premiumSince;



        if(!oldStatus && newStatus) {
            client.channels.cache.get(process.env.boostChannelId).send({ embeds: [this.boosted(newMember)] });
        }

        if(oldStatus && !newStatus) {
            client.channels.cache.get(process.env.boostChannelId).send({ embeds: [this.UnBoosted(newMember)] });
        }
    },
    boosted: (newMember) => {
        return new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`<a:boost:889879155011878972> ${newMember.user.username} has boosted the server!`)
            .setURL('')
            .setDescription(`Thanks for boosting, <@${newMember.user.id}>.`)
            .setColor(15928032)
            .setFooter("We now have 2 boosts!")
            .setThumbnail(`https://cdn.discordapp.com/avatars/${newMember.user.id}/${newMember.user.avatar}.webp`);
    },
    UnBoosted: (newMember) => {
        return new MessageEmbed()
            .setColor(15928032)
            .setDescription(`<a:boost:889879155011878972> ${newMember.user.username} canceled the server boost...`)
    }
};







