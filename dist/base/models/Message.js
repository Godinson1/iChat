"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Reaction }) {
            this.hasMany(Reaction, {
                as: "reactions",
                foreignKey: {
                    name: "messageId",
                },
            });
        }
    }
    Message.init({
        messageId: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        from: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        to: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Message",
        tableName: "messages",
    });
    return Message;
};
