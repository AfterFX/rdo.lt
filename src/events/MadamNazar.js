const { MessageEmbed } = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'ready',
    async execute(client) {
        console.log('Madam Nazar loaded!');
        await client.channels.cache.get(process.env.madamNazarChannelId).messages.fetch(process.env.madamNazarMessageId)
        // this.madam_nazar_location();
        // setInterval(this.madam_nazar_location,(3*1000), client);//every 60s
        // client.channels.cache.get(process.env.madamNazarChannelId)
        this.madam_nazar_location(client);

    },
    madam_nazar_location: (client) => {
        axios.get('https://madam-nazar-location-api.herokuapp.com/location/current')
            .then(function (response) {
                // handle success
                // console.log(response.data)
                // return client.channels.cache.get(process.env.madamNazarChannelId).send({embeds: [module.exports.embed(response.data.data)]});
                return client.channels.cache.get(process.env.madamNazarChannelId).messages.cache.get(process.env.madamNazarMessageId).edit({embeds: [module.exports.embed(response.data.data, response.data.dataFor)]})
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
    embed: (location, date) => {
        return new MessageEmbed()
            .setColor('#0099ff')
            .setDescription(`**Madam Nazar** ${date}\n In ${capitalize(location.location.region.precise)} in the region of ${capitalize(location.location.region.name)}.\n In the ${capitalize(location.location.cardinals.full)} side of the map. nearby & ${capitalize(location.location.near_by[0])}.`)
            .setImage(location.location.image)

    }
}


const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}