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
        async execute(interaction) {
            const { options } = interaction;
            let rolesList = (options.getMember("target")? options.getMember("target")._roles : interaction.member._roles)
            let user = (options.getMember("target")? options.getMember("target").user : interaction.user)

            const platformRoles = [this.user_roles(interaction, rolesList, process.env.pcRoleName), this.user_roles(interaction, rolesList, process.env.psRoleName), this.user_roles(interaction, rolesList, process.env.xboxRoleName)];
            platformRoles.forEach(platformRole => {
                if(platformRole[0]){
                    user.platform = {
                        id: platformRole[0],
                        name: platformRole[1],
                    }
                }else if(user.bot){
                    user.platform = {
                        id: "bot",
                        name: "bot",
                    }
                }
            });

            if(interaction.commandName === "profile") {
                await interaction.reply({embeds: [await this.profile_embed(user)], ephemeral: true});
            }

    },
    profile_embed: async (user) => {
        const UserData = await User.findOne({
            where: {userId: user.id}
        })
        const platform = (user.platform.name === process.env.pcRoleName)? "<:PC:895300967317262366> PC" : (user.platform.name === process.env.psRoleName)? "<:playstation:893088102338412594> Playstation" : (user.platform.name === process.env.xboxRoleName)? "<:XBOX:892829298862481409> Xbox" : "none";
        return new MessageEmbed()
            .setColor('#04426B')
            .setTitle(`${user.username}#${user.discriminator}`)
            .setDescription(`User Information`)
            .addFields({name : 'Platform', value: `${platform}`}, {name : 'Overview', value: `<:exp:901755123909427240> [${UserData.experience}/${(UserData.level+1)*100}] **${UserData.level}** Level\n<:goldbar:901352183134580786> **${UserData.gold}** Gold Bar\n<:money:901365464964415538> **${UserData.money}** Dollars\n<:treasuremap:901755136987267082> **${UserData.treasureMaps}** Maps\n<:dailies:901367816505159710> Longest Daily challenge streak: **${UserData.longestStreak}**`})
            .setThumbnail(user.displayAvatarURL({dynamic: true})) // webp or gif
    },
    user_roles: (interaction, rolesList, role_name) => {
        const found = [rolesList.find(element => element === module.exports.role_list(interaction, role_name).id), role_name];
        return found;
    },
    role_list: (interaction, role_name) => {
        return interaction.guild.roles.cache.find(r => r.name === role_name);
    }
};

