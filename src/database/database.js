const Sequelize = require('sequelize');//https://youtu.be/doppUudjztU?t=1642

module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    // host: 'localhost',
    dialect: 'mysql'
    // logging: false,
    // SQLite only
    // storage: 'database.sqlite',
});