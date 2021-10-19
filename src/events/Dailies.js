const { MessageEmbed } = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'ready',
    async execute(client) {
        console.log('Dailies loaded!');
        await client.channels.cache.get(process.env.dailiesChannelId).messages.fetch(process.env.dailiesMessageId)
        // this.madam_nazar_location();
        // setInterval(this.madam_nazar_location,(3*1000), client);//every 60s
        // client.channels.cache.get(process.env.madamNazarChannelId)
        this.dailies(client);

    },
    dailies: (client) => {
        axios.get('https://pepegapi.jeanropke.net/v2/rdo/dailies')
            .then(function (response) {
                // handle success
                let general = "";
                // console.log(response.data.data[0].challenges)
                response.data.data[0].challenges.forEach(element => {
                    general += element.description.localizedFull + "\n";
                });

                // return client.channels.cache.get(process.env.dailiesChannelId).send({embeds: [module.exports.embed(response.data.data)]});
                return client.channels.cache.get(process.env.dailiesChannelId).messages.cache.get(process.env.dailiesMessageId).edit({embeds: [module.exports.embed(general, response.data.date)]})
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
    embed: (general, date) => {

        return new MessageEmbed()
            .setColor('#0099ff')
            .setDescription(`**Dailies** ${date}\n ${general}`)
    }
}


const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}