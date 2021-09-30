module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;


        if(message.content === "verify"){
            message.delete();
            const messageVerify = await client.channels.cache.get(process.env.verifyChannelId).send({ content: 'Serverio verified sistema', fetch: true });
            const reactionEmoji = client.emojis.cache.get('892475045585240084');
            await messageVerify.react(reactionEmoji);
        }else if(message.content === "info") {
            message.delete();
            const messageInfo = await client.channels.cache.get(process.env.infoChannelId).send({ content: 'Serverio info ir game platformos', fetch: true });
            const pc = client.emojis.cache.get(process.env.pcEmojiId), ps = client.emojis.cache.get(process.env.psEmojiId), xbox = client.emojis.cache.get(process.env.xboxEmojiId);
            messageInfo.react(pc)
                .then(() => messageInfo.react(ps))
                .then(() => messageInfo.react(xbox))
                .catch(error => console.error('info channel: One of the emojis failed to react:', error));
        }


    },
};