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
                reaction.message.guild.members.cache.get(user.id).roles.remove(this.role_list(reaction, process.env.verifyRoleName).id).then( () => {
                    console.log(`User: ${user} have has remove ✅verified role`);
                })
            } catch (error) {
                console.error('Something went wrong when removing verify role:', error);
            }
        }
    },
    role_list: (reaction, role) => {
        return reaction.message.guild.roles.cache.find(r => r.name === role);
    }
};