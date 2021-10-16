const {  MessageEmbed  } = require('discord.js')
const treasure = require("../commands/open/treasure")
const commandCatcher = require("./commandCatcher")
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) return;
        // const buttonCommand = client.commands.get(interaction.message.interaction.commandName);//get reply motherCommand {buttonCommand.permission}

        try {
            if(!interaction.member?.permissions.has("VIEW_CHANNEL")){
                return interaction.update({embeds: [commandCatcher.no_permissions()], ephemeral: true});
            }else{
                if(interaction.customId === "open_treasure"){
                    let button = true;
                    await treasure.open_treasure_map(interaction, button);
                }
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true
            });
        }
    },
};