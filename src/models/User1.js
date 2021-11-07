const { DataTypes, Model, Op } = require('sequelize');
//todo helps transfer users from one to another. after transfer need delete this code
module.exports = class Users1 extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userID:{
                type: DataTypes.STRING(18),
            },
            money: {
                type: DataTypes.FLOAT(11, 2),
                defaultValue: 0
            },
            gold: {
                type: DataTypes.FLOAT(11, 2),
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
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            treasureMaps: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },

        },{
           tableName: 'users1',
           timestamps: false,
           sequelize
        });
    }
}