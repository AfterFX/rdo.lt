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
            setInterval(this.dailies,(10*60*1000), client);
        }
        // setInterval(this.madam_nazar_location,(3*1000), client);//every 60s
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
        let general = dailies[0];
        let bountyHunter = dailies[1];
        let trader = dailies[2];
        let collector = dailies[3];
        let moonshiner = dailies[4];
        let naturalist = dailies[5];
        const d = new Date(date);

        return new MessageEmbed()
            .setColor('#A80505')
            .setDescription(`__**Daily Challenges - ${d.toDateString()}**__`)
            .addFields({name: `<:dailies:901367816505159710> General`, value: `${module.exports.dailies_result(general)}`})
            .addFields({name: `<:bounty:901369556453441556> Bounty Hunter (Rank 15+)`, value: `${module.exports.dailies_result(bountyHunter)}`})
            .addFields({name: `<:trader:901370584766750741> Trader (Rank 15+)`, value: `${module.exports.dailies_result(trader)}`})
            .addFields({name: `<:collector:901370798395228160> Collector (Rank 15+)`, value: `${module.exports.dailies_result(collector)}`})
            .addFields({name: `<:moonshiner:901372001137086484> Moonshiner (Rank 15+)`, value: `${module.exports.dailies_result(moonshiner)}`})
            .addFields({name: `<:naturalist:901372015108325427> Naturalist (Rank 15+)`, value: `${module.exports.dailies_result(naturalist)}`})
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