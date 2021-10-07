const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, Collection, MessageActionRow, MessageButton, MessageAttachment, MessageEmbed, MessageSelectMenu  } = require('discord.js')


module.exports = {
    permission: "SEND_MESSAGES",
    data: new SlashCommandBuilder()
        .setName('wagon')
        .setDescription('Start trader wagon')
        .addStringOption(option =>
            option.setName('distance')
                .setDescription('The gif category')
                .setRequired(true)
                .addChoice('Distant', 'trader_distant')
                .addChoice('Local', 'trader_local')),
    async execute(interaction) {
        const row = new MessageActionRow()
        .addComponents([join]);
const user1 = "476289497282248704";
const user2 = "633564577476640778";
const user3 = "884804747511603270";
const user4 = "698784944549527633";
        const embed = new MessageEmbed()
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


        await interaction.reply({content: `Hey @everyone! user <@${interaction.user.id}> invites to drive ${interaction.options._hoistedOptions[0].value} wagon!`, embeds: [embed], components: [row], ephemeral: true});
        // await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });

    },
};





let join = new MessageButton()
    .setLabel('✘ Join')
    .setStyle("SUCCESS")
    .setCustomId("button_join")