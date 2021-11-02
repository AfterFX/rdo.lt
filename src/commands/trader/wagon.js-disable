const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, Collection, MessageActionRow, MessageButton, MessageAttachment, MessageEmbed, MessageSelectMenu  } = require('discord.js')


module.exports = {
    permission: "SEND_MESSAGES",
    data: new SlashCommandBuilder()
        .setName('wagon')
        .setDescription('Start trader wagon')
        .addStringOption(option =>
            option.setName('distance')
                .setDescription('Select distance')
                .setRequired(true)
                .addChoice('Distant', 'trader_distant')
                .addChoice('Local', 'trader_local')),
    async execute(interaction) {
        const row = new MessageActionRow()
        .addComponents([this.join_button()]);
        let options = interaction.options._hoistedOptions[0].value;
        await interaction.reply({content: `Hey <@&${this.platformId(interaction)}> users! <@${interaction.user.id}> invites to delivery: ${(options === "trader_distant")? "Distant" : "Local"}`, embeds: [this.posse_embed(interaction)], components: [row], ephemeral: true});

    },
    posse_embed: (interaction) => {
        const user1 = "476289497282248704";
        const user2 = "633564577476640778";
        const user3 = "884804747511603270";
        const user4 = "698784944549527633";
        return new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Posse (5/7)')
            .setURL('')
            .setDescription(`***<@${interaction.user.id}>***\n<@${user1}>\n<@${user2}>\n<@${user3}>\n<@${user4}>`)
            .addFields(
                // { name: `@🅰🅵🆃🅴🆁🅵🆇#9607 `, value: '`!map` - Collector map\n`!map2` - Interactive map\n`!event` - Event schedule\n`!server` - Server information\n`!user` - Member information\n`!daily` - Daily Challenge' },
                // { name: '3', value: '\u200B' },
                // { name: '4', value: '\u200b', inline: false },
                // { name: '5', value: '\u200b', inline: false },
            );
    },
    join_button: () =>{
         return new MessageButton()
            .setLabel('✘ Join')
            .setStyle("SUCCESS")
            .setCustomId("button_join")
    },
    user_roles: (interaction, role_name) => {
        const array1 = interaction.member.guild.members.cache.get(interaction.user.id).roles.member._roles;
        const found = array1.find(element => element === module.exports.role_list(interaction, role_name).id);
        return found;
    },
    role_list: (interaction, role_name) => {
        return interaction.member.guild.roles.cache.find(r => r.name === role_name);
    },
    platformId: (interaction) => {
        let pcId = module.exports.user_roles(interaction, process.env.pcRoleName);
        let psId = module.exports.user_roles(interaction, process.env.psRoleName);
        let xboxId = module.exports.user_roles(interaction, process.env.xboxRoleName);

        return (pcId !== undefined)? pcId : (psId !== undefined)? psId : (xboxId !== undefined)? xboxId : undefined;
    }
};