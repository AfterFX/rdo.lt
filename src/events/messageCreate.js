module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;


        if(message.content === "verify"){
            message.delete();
            const messageVerify = await client.channels.cache.get(process.env.verifyChannelId).send({ content: 'Serverio verified sistema', fetch: true });
            const reactionEmoji = client.emojis.cache.get('892475045585240084');
            await messageVerify.react(reactionEmoji);
        }


    },
};