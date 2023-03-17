"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Reaction extends Model {
        static associate({ User, Message }) {
            this.belongsTo(Message, { foreignKey: { name: "messageId" } });
            this.belongsTo(User, { foreignKey: { name: "userId" } });
        }
    }
    Reaction.init({
        reactionId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        messageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Reaction",
        tableName: "reactions",
    });
    return Reaction;
};
