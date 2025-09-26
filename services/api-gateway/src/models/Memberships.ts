import sequelize from "../config/sqldb";
import { DataTypes, Model } from "sequelize";


class Memberships extends Model {
    public id!: number;
    public user_id!: number;
    public organization_id!: number;
    public role!: string;
    public created_at!: Date
    public updated_at!: Date

    public static associate(Model: any) {
        Memberships.belongsTo(Model.Organization, {
            foreignKey: 'organization_id',
            targetKey: 'id',
        });
        Memberships.belongsTo(Model.User, {
            foreignKey: 'user_id',
            targetKey: 'id'
        });
    }
}

Memberships.init({
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    user_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    organization_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    tableName: 'memberships',
    modelName: 'Memberships',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: (memberships: Memberships) => {
            memberships.created_at = new Date();
            memberships.updated_at = new Date();
        },
        beforeUpdate: (memberships: Memberships) => {
            memberships.updated_at = new Date();
        }
    }
});


export default Memberships;
