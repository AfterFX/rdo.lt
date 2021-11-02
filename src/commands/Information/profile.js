const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require("discord.js");
const User = require("../../models/User");

module.exports = {
    permission: "SEND_MESSAGES",
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Get profile info')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Info about a user')
                .addUserOption(option => option.setName('target').setDescription('The user'))),
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName('server')
        //         .setDescription('Info about the server')),
        async execute(interaction) {//todo need create with mention
            const platformRoles = [this.user_roles(interaction, process.env.pcRoleName), this.user_roles(interaction, process.env.psRoleName), this.user_roles(interaction, process.env.xboxRoleName)];
            const { user, options } = interaction;
            platformRoles.forEach(platformRole => {
                if(platformRole[0]){
                    user.platform = {
                        id: platformRole[0],
                        name: platformRole[1],
                    }
                }
            });
            const Target = options.getMember("target");
            console.log(Target)
            if(interaction.commandName === "profile") {
                await interaction.reply({embeds: [await this.profile_embed(user)], ephemeral: true});
            }

    },
    profile_embed: async (user) => {
        const UserData = await User.findOne({
            where: {userId: user.id}
        })
        const platform = (user.platform.name === process.env.pcRoleName)? "<:PC:895300967317262366> PC" : (user.platform.name === process.env.psRoleName)? "<:playstation:893088102338412594> Playstation" : (user.platform.name === process.env.xboxRoleName)? "<:XBOX:892829298862481409> Xbox" : ""
        return new MessageEmbed()
            .setColor('#b70000')
            .setTitle(`${user.username}#${user.discriminator}`)
            .setDescription(`User Information`)
            .addFields({name : 'Platform', value: `${platform}`}, {name : 'Overview', value: `<:exp:901755123909427240> [${UserData.experience}/${(UserData.level+1)*100}] **${UserData.level}** Level\n<:goldbar:901352183134580786> **${UserData.gold}** Gold Bar\n<:money:901365464964415538> **${UserData.money}** Dollars\n<:treasuremap:901755136987267082> **${UserData.treasureMaps}** Maps\n<:dailies:901367816505159710> Longest Daily challenge streak: **${UserData.longestStreak}**`})
            .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif`) // webp or gif
    },
    user_roles: (interaction, role_name) => {
        const array1 = interaction.member._roles;
        const found = [array1.find(element => element === module.exports.role_list(interaction, role_name).id), role_name];
        return found;
    },
    role_list: (interaction, role_name) => {
        return interaction.guild.roles.cache.find(r => r.name === role_name);
    }
};

