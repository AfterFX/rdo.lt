const { MessageEmbed } = require('discord.js');
const axios = require('axios');
axios.defaults.headers = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
};
module.exports = {
    name: 'ready',
    async execute(client) {
        console.log('Madam Nazar loaded!');
        try {
            await client.channels.cache.get(process.env.madamNazarChannelId).messages.fetch(process.env.madamNazarMessageId)
        }catch (e) {
            await client.channels.cache.get(process.env.madamNazarChannelId).send({embeds: [this.restart()]}).then(r => {
                console.log("Set .env madamNazarMessageId:", r.id)
            });
        }finally {
            setInterval(this.madam_nazar_location,(10*60*1000), client);
        }
        // setInterval(this.madam_nazar_location,(3*1000), client);//every 60s
    },
    madam_nazar_location: (client) => {
        axios.get(process.env.MadamNazarLink)
            .then(function (response) {
                // handle success
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
        const d = new Date(date);
        return new MessageEmbed()
            .setColor("#EC0949")
            .setTitle(`Madam Nazar - ${d.toDateString()}`)
            .addFields({name: `<:nazarlocation:901750220763828236>Location`, value: `In **${capitalize(location.location.region.precise)}** in the region of **${capitalize(location.location.region.name)}**.\n In the **${capitalize(location.location.cardinals.full)}** side of the map. nearby & **${capitalize(location.location.near_by[0])}**.`})
            .setImage(location.location.image)

    },
    restart: () => {
        return new MessageEmbed()
            .setColor('#7a0273')
            .setDescription(`**Error, check console!**`)
    }
}


const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}