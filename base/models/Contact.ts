export {};
("use strict");

const { Model } = require("sequelize");
module.exports = (sequelize: any, DataTypes: any) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }: any) {
      this.belongsTo(User, { foreignKey: { name: "userId" } });
    }
  }
  Contact.init(
    {
      contactInitiator: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactRecipient: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactInitiatorPhotoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactRecipientPhotoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Contact",
      tableName: "contacts",
    }
  );
  return Contact;
};
