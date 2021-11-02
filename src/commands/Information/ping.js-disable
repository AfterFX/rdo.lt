const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    permission: "SEND_MESSAGES",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('THIS IS A DESCRIPTION!!!'),
    async execute(interaction) {
      await interaction.reply({content: 'Pong!', ephemeral: true});
    },
};