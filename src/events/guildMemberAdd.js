const User = require("../models/User");
const { MessageAttachment } = require('discord.js')
const attachment = new MessageAttachment('src/img/RDR2_Lietuva_new_user.gif');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        await User.findOrCreate({
            where: {userId: member.user.id}
        }).then((r) => {
            member.guild.channels.cache.get(process.env.notificationsChannelId).send({  content: `**Prerijose naujas kaubojus** <:heal:906903094175080478> <@${member.user.id}>`, files: [attachment] })
        });
    }
};