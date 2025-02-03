class ErrorChecker {
    async error_code(error) {
        if (error.name === "SequelizeValidationError") {
            return 400; // Bad Request - Invalid input data
        }
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return 404; // Not Found - Foreign key violation
        }
        if (error.name === "SequelizeUniqueConstraintError") {
            return 409; // Conflict - Duplicate entry
        }
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return 401; // Unauthorized - Invalid or expired token
        }
        if (error.name === "ForbiddenError") {
            return 403; // Forbidden - Access denied
        }
        if (error.name === "NotFoundError") {
            return 404; // Not Found - Resource not found
        }
        if (error.name === "BadRequestError") {
            return 400; // Bad Request - Invalid request
        }
        if (error.original) {
            switch (error.original.code) {
                case '23502': // Not-null violation
                    return 400;
                case '22P02': // Invalid text representation
                    return 400;
                case '22001': // String data too long
                    return 400;
                case '23514': // Check constraint violation
                    return 400;
                case '42601': // SQL syntax error
                    return 400;
                case '42703': // Undefined column
                    return 400;
                case '42804': // Data type mismatch
                    return 400;
                case '40P01': // Deadlock detected
                case '08006': // Database connection failure
                case '57P03': // Database shutting down
                    return 500;
            }
        }
        return 500; // Internal Server Error - Unknown issue
    }
}

export default new ErrorChecker();
