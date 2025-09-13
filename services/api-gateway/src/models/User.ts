import sequelize from "../config/sqldb";
import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from 'bcrypt';

class User extends Model {
    public id!: number;
    public email!: string;
    public password_hash!: string
    public username!: string;
    public created_at!: Date
    public updated_at!: Date


    public static validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    public static hashPassword(password: string): string {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    public static async createUser(username: string, email: string, password: string, confirmPassword: string): Promise<Object> {
        /**
         * validate email format
         * check if password and confirmPassword match
         * hash the password
         * create the user in the database
         * return success or error message
         */
        interface CreateUserResponse {
            status: boolean;
            user?: User | null;
            message: string;
        }


        try {
            if (this.validateEmail(email) === false) {
                throw new Error('Invalid email format');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const password_hashed = this.hashPassword(password);

            const user = await User.create({ username, email, password_hash: password_hashed });
            if (!user) {
                throw new Error('User creation failed');
            }

            const response: CreateUserResponse = {
                status: true,
                user: user,
                message: 'User created successfully'
            };
            return response;
        } catch (error) {
            const response: CreateUserResponse = {
                status: false,
                message: (error as Error).message || 'User creation failed',
                user: null
            };
            return response;
        }
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
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
    tableName: 'users',
    modelName: 'User',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: (user: User) => {
            user.created_at = new Date();
            user.updated_at = new Date();
        },
        beforeUpdate: (user: User) => {
            user.updated_at = new Date();
        }
    }
});


export default User;