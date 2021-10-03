const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const rowPlatformButtons = new MessageActionRow()
            .addComponents([this.verify_platform_getStart()]);
       if(message.content === "verify_platform") {
            message.delete();
            client.channels.cache.get(process.env.verifyChannelId).send({  embeds: [this.verify_platform_embed()], components: [rowPlatformButtons] });
        }
    },
    verify_platform_getStart: () => {
        return new MessageButton()
            .setLabel('Get Started')
            .setEmoji("✅")
            .setStyle("SECONDARY")
            .setCustomId("verify_platform_getStart_button")
    },
    verify_platform_embed: () => {
        return new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Some title')
            .setURL('https://discord.js.org')
            .setDescription('Some description here');
    }
};