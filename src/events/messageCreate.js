const { MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const rowPlatformButtons = new MessageActionRow()
            .addComponents([this.PC(), this.PS(), this.XBOX()]);
       if(message.content === "verify_platform") {
            message.delete();
            client.channels.cache.get(process.env.verifyChannelId).send({ content: 'Serverio verified sistema', components: [rowPlatformButtons] });
        }
    },
    PC: () => {
        return new MessageButton()
            .setLabel('PC')
            .setEmoji("<:PC:892829069975117854>")
            .setStyle("SECONDARY")
            .setCustomId("button_pc")
    },
    PS: () => {
        return new MessageButton()
            .setLabel('PS')
            .setEmoji("<:playstation:893088102338412594>")
            .setStyle("PRIMARY")
            .setCustomId("button_ps")
    },
    XBOX: () => {
        return new MessageButton()
            .setLabel('XBOX')
            .setEmoji("<:XBOX:892829298862481409>")
            .setStyle("SUCCESS")
            .setCustomId("button_xbox")
    }
};