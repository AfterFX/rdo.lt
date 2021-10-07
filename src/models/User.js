const { DataTypes, Model, Op } = require('sequelize');

module.exports = class User extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId:{
                type: DataTypes.STRING(18),
            },
            money: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            gold: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            level: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            experience: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            clan: {
                type: DataTypes.STRING(45),
                defaultValue: "-"
            },
            messages: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            dailyLastDate: {
                type: DataTypes.STRING,
                defaultValue: 0
            },
            dailyStreak: {
                type: DataTypes.STRING,
                defaultValue: 0
            },
            treasureMaps: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },

        },{
           tableName: 'User',
           timestamps: true,
           sequelize
        });
    }
}