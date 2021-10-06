const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.channelId !== process.env.welcomeChannelId) return;

        const row = new MessageActionRow()
            .addComponents([this.PC(), this.PS(), this.XBOX()]);

        const platformRoles = [this.user_roles(interaction, process.env.pcRoleName), this.user_roles(interaction, process.env.psRoleName), this.user_roles(interaction, process.env.xboxRoleName)];

        platformRoles.forEach(platformRoleId => {
            if(platformRoleId && interaction.customId !== "welcome_platform_getStart_button"){
                this.reset_platform_roles(interaction, platformRoleId);
            }
        });


        if(interaction.customId === "welcome_platform_getStart_button"){
            interaction.reply({embeds: [this.plz_selectPlatform_embed()], components: [row], ephemeral: true, fetchReply: true});
        }else if(interaction.customId === "button_pc"){
            this.select_platform(interaction, process.env.pcRoleName); console.log(`User: ${interaction.user} have selected gaming platform: ${process.env.pcRoleName}`);
        }else if(interaction.customId === "button_ps"){
            this.select_platform(interaction, process.env.psRoleName); console.log(`User: ${interaction.user} have selected gaming platform: ${process.env.psRoleName}`);
        }else if(interaction.customId === "button_xbox"){
            this.select_platform(interaction, process.env.xboxRoleName); console.log(`User: ${interaction.user} have selected gaming platform: ${process.env.xboxRoleName}`);
        }



    },
    PC: () => {
    return new MessageButton()
        .setLabel('PC')
        .setEmoji(`<:PC:${process.env.pcEmojiId}>`)
        .setStyle("SECONDARY")
        .setCustomId("button_pc")
    },
    PS: () => {
    return new MessageButton()
        .setLabel('PS')
        .setEmoji(`<:playstation:${process.env.psEmojiId}>`)
        .setStyle("PRIMARY")
        .setCustomId("button_ps")
    },
    XBOX: () => {
    return new MessageButton()
        .setLabel('XBOX')
        .setEmoji(`<:XBOX:${[process.env.xboxEmojiId]}>`)
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
        const data = (platform === process.env.pcRoleName)? {emoji: `<:PC:${process.env.pcEmojiId}>`, color: '#4f545c'} : (platform === process.env.psRoleName)? {emoji: `<:playstation:${process.env.psEmojiId}>`, color: '#5865f2'} : (platform === process.env.xboxRoleName)? {emoji: `<:XBOX:${[process.env.xboxEmojiId]}>`, color: '#3ba55d'} : {emoji: `😄`, color: '#FFFFFFFF'};
        return new MessageEmbed()
            .setColor(data["color"])
            .setDescription(`**You selected ${data["emoji"]+platform+data["emoji"]}**`)
    },
    user_roles: (interaction, role_name) => {
        const array1 = interaction.message.guild.members.cache.get(interaction.user.id).roles.member._roles;
        const found = array1.find(element => element === module.exports.role_list(interaction, role_name).id);
        return found;
    },
    reset_platform_roles: (interaction, platformRoleId) => {
        return interaction.message.guild.members.cache.get(interaction.user.id).roles.remove(platformRoleId)
    },
    role_list: (interaction, role_name) => {
    return interaction.message.guild.roles.cache.find(r => r.name === role_name);
    }
};