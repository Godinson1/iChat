export {};
("use strict");

const { Model } = require("sequelize");

module.exports = (sequelize: any, DataTypes: any) => {
  class Reaction extends Model {
    static associate({ User, Message }: any) {
      this.belongsTo(Message, { foreignKey: { name: "messageId" } });
      this.belongsTo(User, { foreignKey: { name: "userId" } });
    }
  }

  Reaction.init(
    {
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
    },
    {
      sequelize,
      modelName: "Reaction",
      tableName: "reactions",
    }
  );
  return Reaction;
};
