"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = require("../utils/apiError");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof apiError_1.ApiError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            success: err.success,
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    }
    // fallback for other errors
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        status: statusCode,
        success: false,
        message: err.message || "Internal Server Error",
        errors: [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorhandler.middleware.js.map