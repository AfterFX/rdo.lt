const { MessageActionRow, MessageButton } = require('discord.js');
function role_list (interaction, role_name) {
    return interaction.message.guild.roles.cache.find(r => r.name === role_name);
}
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const row = new MessageActionRow()
            .addComponents([this.PC(), this.PS(), this.XBOX()]);


        if(interaction.customId === "verify_platform_getStart_button"){
            interaction.message.guild.members.cache.get(interaction.user.id).roles.add(role_list(interaction, process.env.pcRoleName).id);
            interaction.reply({content: "SELECT ROLE", components: [row], ephemeral: true});
            // await client.guilds.cache.get("890281869730541578").channels.cache.get("890281869751500886").send({content: "awfawf", ephemeral: true});
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