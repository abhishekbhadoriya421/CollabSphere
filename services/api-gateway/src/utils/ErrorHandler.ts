
export default class ErrorHandler {
    /**
     * Extracts a clean error message from any type of error object
     */
    static getMessage(err: any): string {
        if (!err) return "Unknown error occurred";

        // Sequelize DB errors (MySQL/Postgres etc.)
        if (err.original?.sqlMessage) {
            return err.original.sqlMessage; // MySQL-style error
        }
        if (err.parent?.sqlMessage) {
            return err.parent.sqlMessage;
        }

        // Sequelize validation errors
        if (err.name === "SequelizeValidationError" && Array.isArray(err.errors)) {
            return err.errors.map((e: any) => e.message).join(", ");
        }

        // JS Error object
        if (err instanceof Error) {
            return err.message;
        }

        // Fallback to JSON or string
        if (typeof err === "string") {
            return err;
        }

        return JSON.stringify(err);
    }
}
