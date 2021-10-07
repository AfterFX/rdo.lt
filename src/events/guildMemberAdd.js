const User = require("../models/User");

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        await User.findOrCreate({
            where: {userId: member.user.id}
        });
    }
};