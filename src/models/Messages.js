const { DataTypes, Model } = require('sequelize');

module.exports = class Messages extends Model {
    static init(sequelize) {
        return super.init({
            total:{
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            time_schedule:{
                type: DataTypes.BIGINT,
                defaultValue: 1631480400000
            },
            beforeNumber:{
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
        },{
            tableName: 'messages',
            timestamps: true,
            sequelize
        });
    }
}