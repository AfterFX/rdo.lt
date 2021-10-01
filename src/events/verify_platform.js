const { MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if(interaction.customId === "button_pc"){

        }

        console.log(interaction.customId)
        }


};