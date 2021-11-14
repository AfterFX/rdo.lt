const { MessageAttachment, MessageEmbed } = require('discord.js');
const axios = require('axios');
axios.defaults.headers = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
};
module.exports = {
    name: 'ready',
    async execute(client) {
        console.log('Dailies loaded!');
        try {
            await client.channels.cache.get(process.env.dailiesChannelId).messages.fetch(process.env.dailiesMessageId)
        }catch (e) {
            const file = new MessageAttachment("src/img/Daily_Challenges_RDO.lt.png");
            await client.channels.cache.get(process.env.dailiesChannelId).send({embeds: [this.restart()], files: [file]}).then(r => {
                console.log("Set .env dailiesMessageId:", r.id)
            });
        }finally {
            // this.dailies(client)
            setInterval(this.dailies,(10*60*1000), client);
        }
    },
    dailies: (client) => {
        axios.get(process.env.dailiesLink)
            .then(function (response) {
                // handle success
                return client.channels.cache.get(process.env.dailiesChannelId).messages.cache.get(process.env.dailiesMessageId).edit({embeds: [module.exports.embed(response.data.data, response.data.date)]})
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                // return error;
            })
            .then(function () {
                // always executed
            });
    },
    embed: (dailies, date) => {
        let general = dailies.general;
        let bountyHunterEasy = dailies.easy[0];
        let bountyHunterMedium = dailies.med[0];
        let bountyHunterHard = dailies.hard[0];

        let traderEasy = dailies.easy[1];
        let traderMedium = dailies.med[1];
        let traderHard = dailies.hard[1];

        let collectorEasy = dailies.easy[2];
        let collectorMedium = dailies.med[2];
        let collectorHard = dailies.hard[2];

        let moonshinerEasy = dailies.easy[3];
        let moonshinerMedium = dailies.med[3];
        let moonshinerHard = dailies.hard[3];

        let naturalistEasy = dailies.easy[4];
        let naturalistMedium = dailies.med[4];
        let naturalistHard = dailies.hard[4];

        const d = new Date(date);

        return new MessageEmbed()
            .setColor('#A80505')
            .setDescription(`__**Daily Challenges - ${d.toDateString()}**__`)
            .addFields({name: `<:dailies:901367816505159710> General`, value: `${module.exports.dailies_result(general)}`})
            .addFields({name: `<:bounty:901369556453441556> Bounty Hunter`, value: `***(Rank easy 1-4 lvl)***\n${module.exports.dailies_result(bountyHunterEasy)}***(Rank medium 5-14 lvl)***\n${module.exports.dailies_result(bountyHunterMedium)}***(Rank hard 15+ lvl)***\n${module.exports.dailies_result(bountyHunterHard)}`})
            .addFields({name: `<:trader:901370584766750741> Trader`, value: `***(Rank easy 1-4 lvl)***\n${module.exports.dailies_result(traderEasy)}***(Rank medium 5-14 lvl)***\n${module.exports.dailies_result(traderMedium)}***(Rank hard 15+ lvl)***\n${module.exports.dailies_result(traderHard)}`})
            .addFields({name: `<:collector:901370798395228160> Collector`, value: `***(Rank easy 1-4 lvl)***\n${module.exports.dailies_result(collectorEasy)}***(Rank medium 5-14 lvl)***\n${module.exports.dailies_result(collectorMedium)}***(Rank hard 15+ lvl)***\n${module.exports.dailies_result(collectorHard)}`})
            .addFields({name: `<:moonshiner:901372001137086484> Moonshiner`, value: `***(Rank easy 1-4 lvl)***\n${module.exports.dailies_result(moonshinerEasy)}***(Rank medium 5-14 lvl)***\n${module.exports.dailies_result(moonshinerMedium)}***(Rank hard 15+ lvl)***\n${module.exports.dailies_result(moonshinerHard)}`})
            .addFields({name: `<:naturalist:901372015108325427> Naturalist`, value: `***(Rank easy 1-4 lvl)***\n${module.exports.dailies_result(naturalistEasy)}***(Rank medium 5-14 lvl)***\n${module.exports.dailies_result(naturalistMedium)}***(Rank hard 15+ lvl)***\n${module.exports.dailies_result(naturalistHard)}`})
    },
    dailies_result: (daily) => {
        let result = [];
        daily.challenges.forEach((element) => {
            result += "<:Daily:901350232523177985> " + element.description.localizedFull + "\n";
        });
        return result;
    },
    restart: () => {
        return new MessageEmbed()
            .setColor('#7a0273')
            .setDescription(`**Error, check console!**`)
    }
}
