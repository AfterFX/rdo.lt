const { SlashCommandBuilder } = require('@discordjs/builders');
const {  MessageEmbed  } = require('discord.js')


module.exports = {
    permission: "MANAGE_MESSAGES",
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Deletes a specified number of messages from a channel or a target.')
        // .setDefaultPermission(false)
        .addNumberOption(option =>
            option.setName('amount')
                .setDescription('Select the amount of messages to  from a channel or a target')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Select a target to clear their messages.')
                .setRequired(false)),
    async execute(interaction) {
        // console.linteraction.member?.permissions.has("MANAGE_MESSAGES"));og(

        // const permissions2 = {
        //     id: guild.roles.everyone.id,
        //     type: 'ROLE',
        //     permission: false,
        // };


        // await client.commands.permissions.set({
        //     command: interaction.commandId,
        //     permissions: "MANAGE_MESSAGES"
        // });

        const { channel, options } = interaction;

        const Amount = options.getNumber("amount");
        const Target = options.getMember("target");

        const Messages = await channel.messages.fetch();

        const Response = new MessageEmbed()
            .setColor("LUMINOUS_VIVID_PINK");

        if(Amount > 100 || Amount <= 0) {
            Response.setDescription(`Amount cannot exceed 100, and cannot be under 1.`)
            return interaction.reply({embeds: [Response], ephemeral: true})
        }

        if(Target){
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) =>{
                if(m.author.id === Target.id && Amount > i){
                    filtered.push(m);
                    i++;
                }
            })
            await channel.bulkDelete(filtered, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} messages from ${Target}.`)
                interaction.reply({embeds: [Response]});
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} messages from this channel.`)
                interaction.reply({embeds: [Response]});
            })
        }

    },
};



















//
// module.exports = {
//     name: "clear",
//     description: "Deletes a specified number of messages from a channel or a target.",
//     permission: "MANAGE_MESSAGES",
//     options: [
//         {
//             name: "amount",
//             description: "Select the amount of messages to  from a channel or a target",
//             type: "NUMBER",
//             required: true
//         },
//         {
//             name: "target",
//             description:  "Select a target to clear their messages.",
//             type: "USER",
//             required: false
//         }
//     ],
//     async execute(interaction) {
//
//     }
// };