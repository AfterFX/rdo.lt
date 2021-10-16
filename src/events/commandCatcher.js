const {  MessageEmbed  } = require('discord.js')
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            if(!interaction.member?.permissions.has(command.permission)){
                return interaction.reply({embeds: [this.no_permissions(command)], ephemeral: true});
            }else{
                await command.execute(interaction);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true
            });
        }
    },
    no_permissions: () =>{
        return new MessageEmbed()
            .setColor('RED')
            .setDescription(`🛑 You do not have the required permissions to run this command`)
    }
};