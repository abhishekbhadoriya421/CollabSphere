import sequelize from "../config/sqldb";
import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from 'bcrypt';
import { ValidationError } from "sequelize";

interface CreateUserResponse {
    status: boolean;
    user?: User | null;
    message: string;
}

interface LoginUserResponse {
    status: boolean;
    user: User | null;
    message: string;
}

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

    /**
     * hash the password and compare the password 
     */
    private static hashPassword(password: string): string {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    public static async comparePassword(hash_password: string, password: string): Promise<boolean> {
        return await bcrypt.compare(password, hash_password);
    }

    public static async createUser(username: string, email: string, password: string, confirmPassword: string): Promise<CreateUserResponse> {
        /**
         * validate email format
         * check if password and confirmPassword match
         * hash the password
         * create the user in the database
         * return success or error message
         */

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
            if (error instanceof ValidationError) {
                const messages = error.errors.map(e => `${e.path}: ${e.message}`).join('\n');
                const response: CreateUserResponse = {
                    status: false,
                    message: messages || 'User creation failed',
                    user: null
                };
                return response;
            } else {
                return {
                    status: false,
                    message: 'Unexpected error occurred',
                    user: null
                };
            }
        }
    }

    /**
     * Get User By Email 
     */
    public static async getUserByEmail(email: string): Promise<User | null> {
        if (!email) {
            return null;
        }
        try {
            const user = await User.findOne({
                where: { email: email }
            })

            if (!user) {
                return null;
            } else {
                return user;
            }
        } catch (err) {
            return null;
        }
    }

    /**
     * Validate Login Authentication
     * 1. check email and password is not null
     * 2. check email pattern is valid or not
     * 4. find user by email if not found return status false
     * 5. compair the password if compairsion returns true the create 
     * 6. access token and refresh token 
     */
    public static async AuthenticateUserByEmailAndPassword(email: string, password: string): Promise<LoginUserResponse> {
        try {
            if (!email || !password) {
                return {
                    status: false,
                    user: null,
                    message: "Must provide email and password"
                }
            }

            if (!this.validateEmail(email)) {
                return {
                    status: false,
                    user: null,
                    message: "Email format is not valid"
                }
            }

            const user = await this.getUserByEmail(email) as User | null

            if (!user) {
                return {
                    status: false,
                    user: null,
                    message: "User not found! Please create account first"
                }
            }
            const isValidPassword: boolean = await this.comparePassword(user.password_hash, password);
            if (isValidPassword) {
                const plainUser = user.toJSON();
                const { password_hash, ...safeUser } = plainUser;
                return {
                    status: true,
                    user: safeUser,
                    message: 'Successfully user varified'
                }
            } else {
                return {
                    status: false,
                    user: null,
                    message: 'Incorrect Password'
                }
            }

        } catch (err: any) {
            return {
                status: false,
                user: null,
                message: err.toString()
            }
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