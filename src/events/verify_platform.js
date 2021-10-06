const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const row = new MessageActionRow()
            .addComponents([this.PC(), this.PS(), this.XBOX()]);


        if(interaction.customId === "verify_platform_getStart_button"){
            interaction.reply({embeds: [this.plz_selectPlatform_embed()], components: [row], ephemeral: true, fetchReply: true});
            // await client.guilds.cache.get("890281869730541578").channels.cache.get("890281869751500886").send({content: "awfawf", ephemeral: true});
        }else if(interaction.customId === "button_pc"){
            this.select_platform(interaction, process.env.pcRoleName);
        }else if(interaction.customId === "button_ps"){
            this.select_platform(interaction, process.env.psRoleName);
        }else if(interaction.customId === "button_xbox"){
            this.select_platform(interaction, process.env.xboxRoleName);
        }
console.log(interaction)
        const platformRoles = [this.user_roles(interaction, process.env.pcRoleName), this.user_roles(interaction, process.env.psRoleName), this.user_roles(interaction, process.env.xboxRoleName)];

        platformRoles.forEach(platformRoleId =>{//TODO bug when x2 click multiple times on some platform role.
                if(platformRoleId){
                    interaction.message.guild.members.cache.get(interaction.user.id).roles.remove(platformRoleId)
                }
        });

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
    },
    plz_selectPlatform_embed: () => {
        return new MessageEmbed()
            .setColor('#b89100')
            .setDescription(`**PLEASE SELECT A PLATFORM**`)
    },
    select_platform: (interaction, role) =>{
        interaction.message.guild.members.cache.get(interaction.user.id).roles.add(module.exports.role_list(interaction, role).id);
        interaction.update({embeds: [module.exports.selected_platform_embed(role)]});
    },
    selected_platform_embed: (platform) => {
        const color = (platform === process.env.pcRoleName)? '#4f545c' : (platform === process.env.psRoleName)? '#5865f2' : (platform === process.env.xboxRoleName)? '#3ba55d' : '#FFFFFFFF';
        return new MessageEmbed()
            .setColor(color)
            .setDescription(`**You selected ${platform}**`)
    },
    user_roles: (interaction, role_name) => {
        const array1 = interaction.message.guild.members.cache.get(interaction.user.id).roles.member._roles;
        const found = array1.find(element => element === module.exports.role_list(interaction, role_name).id);
        return found;
    },
    reset_platform_roles: (interaction) => {
        return interaction.message.guild.members.cache.get(interaction.user.id).roles.remove([module.exports.role_list(interaction, "role_name").id]);
    },
    role_list: (interaction, role_name) => {
    return interaction.message.guild.roles.cache.find(r => r.name === role_name);
    }
};