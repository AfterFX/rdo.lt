function role_list (reaction, role_name) {
    return reaction.message.guild.roles.cache.find(r => r.name === role_name);
}

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if (user.bot) return;

        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        if(reaction.message.channelId === process.env.verifyChannelId){//verify channel moderating verify role
            try{
                reaction.message.guild.members.cache.get(user.id).roles.add(role_list(reaction, process.env.verifyRoleName).id).then( () => {
                    console.log(`User: ${user} have has ✅verified on server!`);
                })
            } catch (error) {
                console.error('Something went wrong when adding verify role:', error);
            }
        }else if(reaction.message.channelId === process.env.infoChannelId) {
            //If found already selected game platform, will remove reaction. Blocks multiple reactions.
            if (this.user_roles(reaction, user, process.env.pcRoleName) === true || this.user_roles(reaction, user, process.env.psRoleName) === true || this.user_roles(reaction, user, process.env.xboxRoleName) === true) {
                reaction.users.remove(user);
            } else {
                if(reaction._emoji.name === process.env.psRoleName){
                    reaction.message.guild.members.cache.get(user.id).roles.add(role_list(reaction, process.env.psRoleName).id)
                    console.log(`User: ${user} have selected gaming platform: PLAYSTATION`);
                }else if(reaction._emoji.name === process.env.xboxRoleName){
                    reaction.message.guild.members.cache.get(user.id).roles.add(role_list(reaction, process.env.xboxRoleName).id)
                    console.log(`User: ${user} have selected gaming platform: XBOX`);
                }else if(reaction._emoji.name === process.env.pcRoleName){
                    reaction.message.guild.members.cache.get(user.id).roles.add(role_list(reaction, process.env.pcRoleName).id)
                    console.log(`User: ${user} have selected gaming platform: PC`);
                }
            }

        }
    },
    user_roles: (reaction, user, role_name) => {
        const array1 = reaction.message.guild.members.cache.get(user.id).roles.member._roles;
        const found = array1.find(element => element === role_list(reaction, role_name).id);
        return found !== undefined;
    }
};