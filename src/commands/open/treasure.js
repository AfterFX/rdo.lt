const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const User = require("../../models/User");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    permission: "SEND_MESSAGES",
    data: new SlashCommandBuilder()
        .setName('open')
        .setDescription('Open and get rewards!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('treasure')
                .setDescription('Open the treasure and get rewards!')),
    async execute(interaction) {
        const button = false;
    await this.open_treasure_map(interaction, button);

    },
    getRandomArbitrary: (min, max) => {
    return Math.random() * (max - min) + min;
    },
    reward_embed: (money, gold) => {
        return new MessageEmbed()
            .setColor('#42b700')
            .setDescription(`**Treasure opened!** money: ${money}, gold: ${gold}`)
    },
    zero_treasure_embed: () => {
        return new MessageEmbed()
            .setColor('#b70000')
            .setDescription(`**You don't have a treasure map!**`)
    },
    open_treasure_map: async (interaction, button) => {
        let open_treasure = new MessageButton()
            .setLabel('Open treasure again')
            .setStyle("SUCCESS")
            .setCustomId("open_treasure")
        const open_button = new MessageActionRow()
            .addComponents([open_treasure]);
        await User.findOne({ where: { userId: interaction.user.id } }).then((user) => {
            if(user.treasureMaps > 0){
                const money = Math.floor(module.exports.getRandomArbitrary(Number(process.env.moneyMin), Number(process.env.moneyMax)));
                const gold = Math.round(module.exports.getRandomArbitrary(Number(process.env.goldMin), Number(process.env.goldMax))*100)/100;
                user.money = user.money+money;
                user.gold = user.gold+gold;
                user.treasureMaps = user.treasureMaps-1;
                user.save().then(() =>{
                    if(!button){
                        interaction.reply({embeds: [module.exports.reward_embed(money, gold)], components: [open_button], ephemeral: true})
                    }else{
                        interaction.update({embeds: [module.exports.reward_embed(money, gold)], components: [open_button], ephemeral: true})
                    }
                });
            }else{
                if(!button){
                    interaction.reply({embeds: [module.exports.zero_treasure_embed()], ephemeral: true});
                }else{
                    interaction.update({embeds: [module.exports.zero_treasure_embed()], ephemeral: true});
                }

            }
        });
    }

};

