function role_list (reaction, role_name) {
    return reaction.message.guild.roles.cache.find(r => r.name === role_name);
}

module.exports = {
    name: 'messageReactionRemove',
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
                reaction.message.guild.members.cache.get(user.id).roles.remove(role_list(reaction, process.env.verifyRoleName).id).then( () => {
                    console.log(`User: ${user} have has remove ✅verified role`);
                })
            } catch (error) {
                console.error('Something went wrong when removing verify role:', error);
            }
        }else if(reaction.message.channelId === process.env.infoChannelId) {
            if(reaction._emoji.name === process.env.psRoleName){
                this.remove_role(reaction, user, process.env.psRoleName);
                console.log(`User: ${user} have removed gaming platform: PS4`);
            }else if(reaction._emoji.name === process.env.xboxRoleName){
                this.remove_role(reaction, user, process.env.xboxRoleName);
                console.log(`User: ${user} have removed gaming platform: XBOX one`);
            }else if(reaction._emoji.name === process.env.pcRoleName){
                this.remove_role(reaction, user, process.env.pcRoleName);
                console.log(`User: ${user} have removed gaming platform: PC`);
            }
        }
    },
    remove_role: (reaction, user, role_name) => {
        return reaction.message.guild.members.cache.get(user.id).roles.remove([role_list(reaction, role_name).id]);
    }
};